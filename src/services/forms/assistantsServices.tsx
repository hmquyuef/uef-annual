import apiClient from "../apiClient";
import { ImportResponse } from "./formsServices";

export interface ClassAssistantItem {
  id: string;
  userName: string;
  fullName: string;
  unitName: string;
  semester: string;
  activityName: string;
  classCode: string;
  standardNumber: number;
  fromDate: number;
  entryDate: number;
  eventDate: number;
  proof: string;
  note: string;
}

export interface ClassAssistantResponse {
  items: ClassAssistantItem[];
  totalCount: number;
}

export async function getAllClassAssistants(): Promise<ClassAssistantResponse> {
  const response = await apiClient.get<ClassAssistantResponse>(
    "api/assistants"
  );
  return response.data;
}

export async function postAddClassAssistant(
  data: Partial<ClassAssistantItem>
): Promise<ClassAssistantItem> {
  const response = await apiClient.post<ClassAssistantItem>(
    "api/assistants",
    data
  );
  return response.data;
}

export async function putUpdateClassAssistant(
  id: string,
  data: Partial<ClassAssistantItem>
): Promise<ClassAssistantItem> {
  const response = await apiClient.put<ClassAssistantItem>(
    `api/assistants/${id}`,
    data
  );
  return response.data;
}

export async function deleteClassAssistants(ids: string[]): Promise<void> {
  await apiClient.delete("api/assistants", {
    data: ids,
  });
}

export async function ImportClassAssistants(
  data: FormData
): Promise<ImportResponse> {
  const response = await apiClient.post<ImportResponse>(
    "api/assistants/import",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
