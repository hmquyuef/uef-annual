import apiClient from "../apiClient";
import { Determinations } from "../forms/Determinations";
import { MembersInfomations } from "./membersInfomation";

export interface YouthUnionItem {
  id: string;
  contents: string;
  eventVenue: string;
  sponsor: string;
  determinations: Determinations;
  members: MembersInfomations[];
  note: string;
}

export interface YouthUnionsResponse {
  items: YouthUnionItem[];
  totalCount: number;
}

export async function getAllYouthUnions(
  yearId: string
): Promise<YouthUnionsResponse> {
  let url = `api/union-youths?Years=${yearId}`;
  const response = await apiClient.get<YouthUnionsResponse>(url);
  return response.data;
}

export async function getExportYouthUnion(
  yearId: string,
  unitCode: string | null
): Promise<any> {
  let url = unitCode
    ? `api/union-youths/export?unitCode=${unitCode}&SchoolYearId=${yearId}&FromDate=0&ToDate=0`
    : `api/union-youths/export?SchoolYearId=${yearId}&FromDate=0&ToDate=0`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function postYouthUnion(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/union-youths", data);
  return response.data;
}

export async function putYouthUnion(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/union-youths/${id}`, data);
  return response.data;
}

export async function putListMembersYouthUnion(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/union-youths/members/${id}`,
    data
  );
  return response.data;
}

export async function deleteYouthUnions(ids: string[]): Promise<void> {
  await apiClient.delete("api/union-youths", {
    data: ids,
  });
}

export async function ImportYouthUnionsMembers(data: FormData): Promise<any> {
  const response = await apiClient.post<any>("api/union-youths/members", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function ImportYouthUnions(data: FormData): Promise<any> {
  const response = await apiClient.post<any>("api/union-youths/import", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
