import apiClient from "../apiClient";

export interface QAItem {
  id: string;
  userName: string;
  middleName: string;
  firstName: string;
  fullName: string;
  unitName: string;
  contents: string;
  totalStudent: number;
  standardNumber: number;
  attendances: number;
  note: string;
}

export interface AddUpdateQAItem {
  id: string;
  userName: string;
  middleName: string;
  firstName: string;
  unitName: string;
  contents: string;
  totalStudent: number;
  standardNumber: number;
  attendances: number;
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

export async function postAddQA(
  data: Partial<AddUpdateQAItem>
): Promise<AddUpdateQAItem> {
  const response = await apiClient.post<AddUpdateQAItem>(
    "api/qae",
    data
  );
  return response.data;
}

export async function putUpdateQA(
  id: string,
  data: Partial<AddUpdateQAItem>
): Promise<AddUpdateQAItem> {
  const response = await apiClient.put<AddUpdateQAItem>(
    `api/qae/${id}`,
    data
  );
  return response.data;
}

export async function deleteQAs(ids: string[]): Promise<void> {
  await apiClient.delete("api/qae", {
    data: ids,
  });
}
