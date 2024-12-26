import apiClient from "../apiClient";
import { PaymentApprovedItem } from "../forms/PaymentApprovedItem";

export interface TeachingRegulationItem {
  id: string;
  userName: string;
  fullName: string;
  unitName: string;
  notifiedAbsences: number;
  unnotifiedAbsences: number;
  lateEarly: number;
  entryDate: number;
  payments: PaymentApprovedItem;
  note: string;
}

export interface TeachingRegulationsResponse {
  items: TeachingRegulationItem[];
  totalCount: number;
}

export async function getAllTeachingRegulations(
  yearId: string
): Promise<TeachingRegulationsResponse> {
  let url = yearId
    ? `api/regulations/teaching?Years=${yearId}`
    : "api/regulations/teaching";
  const response = await apiClient.get<TeachingRegulationsResponse>(url);
  return response.data;
}

export async function postTeachingRegulation(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/regulations/teaching", data);
  return response.data;
}

export async function putTeachingRegulation(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/regulations/teaching/${id}`,
    data
  );
  return response.data;
}

export async function putApprovedgetTeachingRegulation(
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `/api/regulations/teaching/approved`,
    data
  );
  return response.data;
}

export async function deleteTeachingRegulations(ids: string[]): Promise<void> {
  await apiClient.delete("api/regulations/teaching", {
    data: ids,
  });
}

export async function ImportTeachingRegulations(data: FormData): Promise<any> {
  const response = await apiClient.post<any>(
    "api/regulations/teaching/import",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
