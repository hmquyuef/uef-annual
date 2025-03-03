import apiClient from "../apiClient";

export async function getAllReports(years: string): Promise<any> {
  let url = `api/reports?Years=${years}`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function getReportMultiMonths(years: string): Promise<any> {
  let url = `api/reports/multi-months?Years=${years}`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function getReportMultiYears(): Promise<any> {
  let url = "api/reports/multi-years";
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function getDataFaculties(yearId: string): Promise<any> {
  let url = `api/reports/faculties?Years=${yearId}`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function getDataFacultiesById(
  yearId: string,
  id: string
): Promise<any> {
  let url = `api/reports/faculties/${id}?Years=${yearId}`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function getDataHuman(yearId: string): Promise<any> {
  let url = `api/reports/human?Years=${yearId}`;
  const response = await apiClient.get<any>(url);
  return response.data;
}
