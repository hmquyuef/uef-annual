import apiClient from "../apiClient";
import { Determinations } from "../forms/Determinations";
import { PaymentApprovedItem } from "../forms/PaymentApprovedItem";

export interface TrainingLevelItem {
  id: string;
  userName: string;
  fullName: string;
  unitName: string;
  contents: string;
  issuanceDate: number;
  issuancePlace: string;
  type: string;
  determinations: Determinations;
  payments: PaymentApprovedItem;
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

export async function putApprovedTrainingLevel(
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`/api/training/approved`, data);
  return response.data;
}

export async function deleteTrainingLevels(ids: string[]): Promise<void> {
  await apiClient.delete("api/training", {
    data: ids,
  });
}

export async function ImportTrainingLevels(data: FormData): Promise<any> {
  const response = await apiClient.post<any>("api/training/import", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
