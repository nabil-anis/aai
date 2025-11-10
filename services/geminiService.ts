import { GoogleGenAI, Type } from "@google/genai";
import { AppConfig, ProjectReport, UploadedFile } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("Missing Gemini API Key. Please set it in your environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const baseResponseSchema = {
    type: Type.OBJECT,
    properties: {
        projectTitle: { type: Type.STRING },
        submissionType: { type: Type.STRING },
        discipline: { type: Type.STRING },
        academicLevel: { type: Type.STRING },
        overallScore: { type: Type.INTEGER, description: "A score from 0 to 100" },
        summaryTitle: { type: Type.STRING, description: "A concise, professional title for the summary, e.g., 'Excellent with Minor Revisions'" },
        scoredCategories: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    category: { type: Type.STRING },
                    score: { type: Type.INTEGER },
                    justification: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["category", "score", "justification"]
            },
        },
        originalityReport: {
            type: Type.OBJECT,
            properties: {
                originalityScore: { type: Type.INTEGER },
                summary: { type: Type.STRING },
                findings: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            finding: { type: Type.STRING },
                            explanation: { type: Type.STRING },
                        },
                        required: ["finding", "explanation"]
                    },
                },
            },
        },
        overallAnalysis: { type: Type.STRING, description: "A detailed paragraph of overall analysis." },
        suggestedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
        vivaQuestions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question_number: { type: Type.INTEGER },
                    question: { type: Type.STRING },
                    expected_answer_points: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
                required: ["question_number", "question", "expected_answer_points"]
            },
        },
    },
    required: ["projectTitle", "submissionType", "discipline", "academicLevel", "overallScore", "summaryTitle", "scoredCategories", "overallAnalysis", "suggestedActions", "vivaQuestions"]
};


export const analyzeProject = async (config: AppConfig, files: UploadedFile[]): Promise<ProjectReport> => {
    const model = 'gemini-2.5-pro';

    const fileContents = files.map(file => `
--- FILE START: ${file.name} ---
Content (Base64 Encoded): ${file.content}
--- FILE END: ${file.name} ---
    `).join('\n');

    let prompt = `
    You are ASAP AI, a strict, unemotional, and professional university professor evaluating a student project.
    Your task is to provide a comprehensive, critical, and objective evaluation based ONLY on the information provided.
    Do not invent details. Your tone must be formal and academic.

    **Project Details:**
    - Title: "${config.projectTitle}"
    - Discipline: ${config.discipline}
    - Academic Level: ${config.academicLevel}
    - Project URL: ${config.projectURL || 'Not provided.'}
    - Evaluation Context: ${config.evaluationContext}
    
    **Project Files:**
    ${files.length > 0 ? fileContents : 'No files were uploaded.'}

    **Evaluation Mandate:**
    1.  **Analyze and Score:** Evaluate the project against the following criteria. For each criterion, provide a score from 0-100 and a list of justifications for that score.
        - Evaluation Criteria: ${config.evaluationCriteria.join(', ')}
    `;

    if (files.length === 0) {
        prompt += `
        - **Special Instruction:** No project files were uploaded. If 'Documentation' is one of the evaluation criteria, you MUST assign it a score of 0. Justify this score by stating that no documents were provided for review. For all other criteria, evaluate as normal based on the available information (like the URL and context).
        `;
    }

    prompt += `
    2.  **Calculate Overall Score:** Compute a weighted average of the criteria scores to determine an overall score.
    3.  **Provide Summary:** Write a concise summary title (e.g., "Pass with Distinction", "Requires Major Revision").
    4.  **Detailed Analysis:** Write a comprehensive paragraph analyzing the project's strengths and weaknesses.
    5.  **Actionable Suggestions:** Provide a list of concrete, actionable steps the student should take to improve the work.
    6.  **Viva Questions:** Generate exactly 10 challenging viva voce (oral defense) questions that probe the student's understanding of their project, its context, and its limitations. Each question should be accompanied by a list of key points expected in a good answer.
    `;
    
    if (config.checkOriginality) {
        prompt += `
    7.  **Originality Check:** Perform a conceptual originality check.
        -   Assess if the project concept is novel or a common/tutorial-level implementation.
        -   Identify potential sources of unoriginality (e.g., standard library examples, popular online tutorials, highly similar public repositories).
        -   Provide an "Originality Score" from 0-100 (where 100 is completely original) and a summary.
        -   List specific potential findings if any exist. If the project appears original, the findings array should be empty.
        `;
    }

    prompt += `
    **Output Format:**
    You MUST return your entire response as a single, valid JSON object that strictly adheres to the provided schema. Do not include any text, explanations, or markdown formatting outside of the JSON object.
    If 'checkOriginality' was false, the 'originalityReport' key should be omitted from the final JSON.
    `;

    const getFinalSchema = (checkOriginality: boolean) => {
        if (checkOriginality) {
            return baseResponseSchema;
        }
        const { originalityReport, ...restProperties } = baseResponseSchema.properties;
        return {
            ...baseResponseSchema,
            properties: restProperties,
        };
    };

    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: getFinalSchema(config.checkOriginality),
                temperature: 0.2,
            }
        });

        const text = response.text;
        if (!text) {
            throw new Error("API returned an empty response.");
        }
        
        const parsedJson = JSON.parse(text);
        return parsedJson as ProjectReport;

    } catch (e) {
        console.error("Error calling Gemini API or parsing response:", e);
        throw new Error("Failed to get a valid analysis from the AI. The model may be overloaded or the request was invalid. Please check your inputs and try again.");
    }
};