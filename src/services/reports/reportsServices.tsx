import apiClient from "../apiClient";

export interface ReportItem {
  formName: string;
  totalItems: number;
  totalApprovedItems: number;
  percentage: number;
  approvedPercent: number;
}

export interface ReportResponses {
  totalItems: number;
  form_BM01: ReportItem;
  form_BM02: ReportItem;
  form_BM03: ReportItem;
  form_BM04: ReportItem;
  form_BM05: ReportItem;
}

export async function getAllReports(years: string): Promise<ReportResponses> {
  let url = `api/reports?Years=${years}`;
  const response = await apiClient.get<ReportResponses>(url);
  return response.data;
}

export async function getAllReportsWithTypeTime(
  years: string,
  typeTime: string
): Promise<any> {
  let url = `/api/reports/multiline?Years=${years}&TypeTime=${typeTime}`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function getDataFaculties(yearId: string): Promise<any> {
  let url = `api/reports/faculties?Years=${yearId}`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function getDataHuman(yearId: string): Promise<any> {
  let url = `api/reports/human?Years=${yearId}`;
  const response = await apiClient.get<any>(url);
  return response.data;
}