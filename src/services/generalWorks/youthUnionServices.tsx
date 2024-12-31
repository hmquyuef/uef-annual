import apiClient from "../apiClient";
import { AttackmentItem } from "../forms/Attackment";
import { MembersInfomations } from "./membersInfomation";

export interface YouthUnionItem {
  id: string;
  contents: string;
  documentNumber: string;
  internalNumber: string;
  documentDate: number;
  fromDate: number;
  toDate: number;
  entryDate: number;
  eventVenue: string;
  sponsor: string
  members: MembersInfomations[];
  attackment: AttackmentItem;
  note: string;
}

export interface YouthUnionsResponse {
  items: YouthUnionItem[];
  totalCount: number;
}

export async function getAllYouthUnions(
  yearId: string
): Promise<YouthUnionsResponse> {
  let url = yearId
    ? `api/general/union/youth?Years=${yearId}`
    : "api/general/union/youth";
  const response = await apiClient.get<YouthUnionsResponse>(url);
  return response.data;
}

export async function postYouthUnion(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/general/union/youth", data);
  return response.data;
}

export async function putYouthUnion(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/general/union/youth/${id}`,
    data
  );
  return response.data;
}

export async function deleteYouthUnions(ids: string[]): Promise<void> {
  await apiClient.delete("api/general/union/youth", {
    data: ids,
  });
}

export async function ImportYouthUnions(data: FormData): Promise<any> {
  const response = await apiClient.post<any>(
    "api/general/union/youth/import",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
