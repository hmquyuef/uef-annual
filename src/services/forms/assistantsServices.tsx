import apiClient from "../apiClient";
import { AttackmentItem } from "./Attackment";
import { ImportResponse } from "./formsServices";
import { PaymentApprovedItem } from "./PaymentApprovedItem";

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
  toDate: number;
  entryDate: number;
  documentDate: number;
  attackment: AttackmentItem;
  payments: PaymentApprovedItem;
  proof: string;
  note: string;
}

export interface ClassAssistantResponse {
  items: ClassAssistantItem[];
  totalCount: number;
}

export async function getAllClassAssistants(
  yearId: string
): Promise<ClassAssistantResponse> {
  let url = yearId ? `api/assistants?Years=${yearId}` : "api/leaders";
  const response = await apiClient.get<ClassAssistantResponse>(url);
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

export async function putUpdateApprovedClassAssistant(
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`/api/assistants/approved`, data);
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
