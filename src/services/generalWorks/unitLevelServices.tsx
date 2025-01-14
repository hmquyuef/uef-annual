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
  let url = yearId ? `api/general/units?Years=${yearId}` : "api/general/units";
  const response = await apiClient.get<UnitLevelsResponse>(url);
  return response.data;
}

export async function postUnitLevel(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/general/units", data);
  return response.data;
}

export async function putUnitLevel(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/general/units/${id}`, data);
  return response.data;
}

export async function putListMembersUnitLevel(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/general/units/members/${id}`,
    data
  );
  return response.data;
}

export async function deleteUnitLevels(ids: string[]): Promise<void> {
  await apiClient.delete("api/general/units", {
    data: ids,
  });
}

export async function ImportUnitLevels(data: FormData): Promise<any> {
  const response = await apiClient.post<any>("api/general/units/import", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
