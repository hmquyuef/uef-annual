import apiClient from "../apiClient";
import { Determinations } from "../forms/Determinations";
import { MembersInfomations } from "./membersInfomation";

export interface UnitLevelItem {
  id: string;
  contents: string;
  entryDate: number;
  eventVenue: string;
  sponsor: string;
  determinations: Determinations;
  members: MembersInfomations[];
  note: string;
}

export interface UnitLevelsResponse {
  items: UnitLevelItem[];
  totalCount: number;
}

export async function getAllUnitLevels(
  yearId: string
): Promise<UnitLevelsResponse> {
  let url = `api/level-units?Years=${yearId}`;
  const response = await apiClient.get<UnitLevelsResponse>(url);
  return response.data;
}

export async function getExportUnitLevel(
  yearId: string,
  unitCode: string | null
): Promise<any> {
  let url = unitCode
    ? `api/level-units/export?unitCode=${unitCode}&SchoolYearId=${yearId}&FromDate=0&ToDate=0`
    : `api/level-units/export?SchoolYearId=${yearId}&FromDate=0&ToDate=0`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function postUnitLevel(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/level-units", data);
  return response.data;
}

export async function putUnitLevel(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/level-units/${id}`, data);
  return response.data;
}

export async function putListMembersUnitLevel(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/level-units/members/${id}`,
    data
  );
  return response.data;
}

export async function deleteUnitLevels(ids: string[]): Promise<void> {
  await apiClient.delete("api/level-units", {
    data: ids,
  });
}

export async function ImportUnitLevelsMembers(data: FormData): Promise<any> {
  const response = await apiClient.post<any>("api/level-units/members", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function ImportUnitLevels(data: FormData): Promise<any> {
  const response = await apiClient.post<any>("api/level-units/import", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
