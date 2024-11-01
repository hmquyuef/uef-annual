import apiClient from "../apiClient";
import { ImportResponse } from "./formsServices";

export interface QAItem {
  id: string;
  userName: string;
  fullName: string;
  unitName: string;
  contents: string;
  totalStudent: number;
  standardNumber: number;
  fromDate: number;
  entryDate: number;
  eventDate: number;
  proof: string;
  note: string;
}

export interface QAResponse {
  items: QAItem[];
  totalCount: number;
}

export async function getAllQAs(): Promise<QAResponse> {
  const response = await apiClient.get<QAResponse>("api/qae");
  return response.data;
}

export async function postAddQA(data: Partial<QAItem>): Promise<QAItem> {
  const response = await apiClient.post<QAItem>("api/qae", data);
  return response.data;
}

export async function putUpdateQA(
  id: string,
  data: Partial<QAItem>
): Promise<QAItem> {
  const response = await apiClient.put<QAItem>(`api/qae/${id}`, data);
  return response.data;
}

export async function deleteQAs(ids: string[]): Promise<void> {
  await apiClient.delete("api/qae", {
    data: ids,
  });
}

export async function ImportQAs(data: FormData): Promise<ImportResponse> {
  const response = await apiClient.post<ImportResponse>(
    "api/qae/import",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
