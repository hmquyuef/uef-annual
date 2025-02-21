import apiClient from "../apiClient";
import { Determinations } from "../forms/Determinations";
import { MembersInfomations } from "./membersInfomation";

export interface LaborUnionItem {
  id: string;
  contents: string;
  eventVenue: string;
  sponsor: string;
  determinations: Determinations;
  members: MembersInfomations[];
  note: string;
}

export interface LaborUnionsResponse {
  items: LaborUnionItem[];
  totalCount: number;
}

export async function getAllLaborUnions(
  yearId: string
): Promise<LaborUnionsResponse> {
  let url = `api/union-labors?Years=${yearId}`;
  const response = await apiClient.get<LaborUnionsResponse>(url);
  return response.data;
}

export async function getExportLaborUnion(
  yearId: string,
  unitCode: string | null
): Promise<any> {
  let url = unitCode
    ? `api/union-labors/export?unitCode=${unitCode}&SchoolYearId=${yearId}&FromDate=0&ToDate=0`
    : `api/union-labors/export?SchoolYearId=${yearId}&FromDate=0&ToDate=0`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function postLaborUnion(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/union-labors", data);
  return response.data;
}

export async function putLaborUnion(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/union-labors/${id}`, data);
  return response.data;
}

export async function putListMembersLaborUnion(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/union-labors/members/${id}`,
    data
  );
  return response.data;
}

export async function deleteLaborUnions(ids: string[]): Promise<void> {
  await apiClient.delete("api/union-labors", {
    data: ids,
  });
}

export async function ImportLaborUnionsMembers(data: FormData): Promise<any> {
  const response = await apiClient.post<any>("api/union-labors/members", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function ImportLaborUnions(data: FormData): Promise<any> {
  const response = await apiClient.post<any>("api/union-labors/import", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}