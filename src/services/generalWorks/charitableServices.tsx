import apiClient from "../apiClient";
import { Determinations } from "../forms/Determinations";
import { MembersInfomations } from "./membersInfomation";

export interface CharitableItem {
  id: string;
  eventsOrganizer: string;
  contents: string;
  eventVenue: string;
  sponsor: string;
  determinations: Determinations;
  members: MembersInfomations[];
  note: string;
}

export interface CharitablesResponse {
  items: CharitableItem[];
  totalCount: number;
}

export async function getAllCharitables(
  yearId: string
): Promise<CharitablesResponse> {
  let url = yearId ? `api/charity?Years=${yearId}` : "api/charity";
  const response = await apiClient.get<CharitablesResponse>(url);
  return response.data;
}

export async function getExportCharitable(
  yearId: string,
  unitCode?: string | null
): Promise<any> {
  let url = unitCode
    ? `api/charity/export?unitCode=${unitCode}&SchoolYearId=${yearId}&FromDate=0&ToDate=0`
    : `api/charity/export?SchoolYearId=${yearId}&FromDate=0&ToDate=0`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function postCharitable(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/charity", data);
  return response.data;
}

export async function putCharitable(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/charity/${id}`, data);
  return response.data;
}

export async function putListMembersCharitable(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/charity/members/${id}`, data);
  return response.data;
}

export async function deleteCharitables(ids: string[]): Promise<void> {
  await apiClient.delete("api/charity", {
    data: ids,
  });
}

export async function ImportCharitablesMembers(data: FormData): Promise<any> {
  const response = await apiClient.post<any>("api/charity/members", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function ImportCharitables(data: FormData): Promise<any> {
  const response = await apiClient.post<any>("api/charity/import", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
