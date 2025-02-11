import apiClient from "../apiClient";
import { Determinations } from "./Determinations";
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
  determinations: Determinations;
  payments: PaymentApprovedItem;
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

export async function getExportAssistant(
  unitCode: string,
  yearId: string
): Promise<any> {
  let url = unitCode
    ? `api/assistants/export?unitCode=${unitCode}&SchoolYearId=${yearId}&FromDate=0&ToDate=0`
    : `api/assistants/export?SchoolYearId=${yearId}&FromDate=0&ToDate=0`;
  const response = await apiClient.get<any>(url);
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
