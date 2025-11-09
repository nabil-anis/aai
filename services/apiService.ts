
import { ProjectReport } from '../types';

const API_BASE_URL = '/api/data';

// Note: This is a mock API service. In a real application, this would
// interact with a live backend. The Vercel/Vite config will proxy these
// requests, but a backend service needs to exist at the target URL.
// For this self-contained app, these calls are expected to fail gracefully.

export const getReports = async (): Promise<ProjectReport[]> => {
  // In a real app, you would fetch from the API.
  // For now, we return an empty array to allow fallback to localStorage.
  console.log("Attempting to fetch reports from server...");
  // const response = await fetch(API_BASE_URL);
  // if (!response.ok) {
  //   throw new Error('Failed to fetch reports from the server.');
  // }
  // return response.json();
  return Promise.reject("API not implemented");
};

export const saveReport = async (report: ProjectReport): Promise<ProjectReport> => {
  console.log("Attempting to save report to server...");
  // const response = await fetch(API_BASE_URL, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify(report),
  // });

  // if (!response.ok) {
  //   throw new Error('Failed to save the report to the server.');
  // }
  // return response.json();
  return Promise.reject("API not implemented");
};

export const deleteReport = async (reportId: string): Promise<void> => {
  console.log(`Attempting to delete report ${reportId} from server...`);
  // const response = await fetch(`${API_BASE_URL}/${reportId}`, {
  //   method: 'DELETE',
  // });

  // if (!response.ok) {
  //   throw new Error('Failed to delete the report from the server.');
  // }
  return Promise.reject("API not implemented");
};
