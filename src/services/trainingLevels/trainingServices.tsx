import apiClient from "../apiClient";
import { Determinations } from "../forms/Determinations";

export interface TrainingLevelItem {
  id: string;
  userName: string;
  fullName: string;
  unitName: string;
  contentId: string;
  contents: string;
  issuanceDate: number;
  location: string;
  abbreviation: string;
  type: string;
  determinations: Determinations;
  note: string;
}

export interface TrainingLevelsResponse {
  items: TrainingLevelItem[];
  totalCount: number;
}

export async function getAllTrainingLevels(
  yearId: string
): Promise<TrainingLevelsResponse> {
  let url = yearId ? `api/training?Years=${yearId}` : "api/training";
  const response = await apiClient.get<TrainingLevelsResponse>(url);
  return response.data;
}

export async function getExportTrainingLevel(
  yearId: string,
  unitCode?: string | null
): Promise<any> {
  let url = unitCode
    ? `api/training/export?unitCode=${unitCode}&SchoolYearId=${yearId}&FromDate=0&ToDate=0`
    : `api/training/export?SchoolYearId=${yearId}&FromDate=0&ToDate=0`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function postTrainingLevel(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/training", data);
  return response.data;
}

export async function putTrainingLevel(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/training/${id}`, data);
  return response.data;
}

export async function deleteTrainingLevels(ids: string[]): Promise<void> {
  await apiClient.delete("api/training", {
    data: ids,
  });
}