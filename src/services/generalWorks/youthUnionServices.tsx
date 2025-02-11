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
  let url = `api/general/union/youth?Years=${yearId}`;
  const response = await apiClient.get<YouthUnionsResponse>(url);
  return response.data;
}

export async function getExportYouthUnion(
  yearId: string,
  unitCode: string | null
): Promise<any> {
  let url = unitCode
    ? `api/general/union/youth/export?unitCode=${unitCode}&SchoolYearId=${yearId}&FromDate=0&ToDate=0`
    : `api/general/union/youth/export?SchoolYearId=${yearId}&FromDate=0&ToDate=0`;
  const response = await apiClient.get<any>(url);
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

export async function putListMembersYouthUnion(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/general/union/youth/members/${id}`,
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
