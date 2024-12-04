import apiClient from "../apiClient";

export interface UnitItem {
  id: string;
  idHrm: string;
  name: string;
  code: string;
}

export interface UnitHRMItem {
  id: string;
  code: string;
  name: string;
}

export interface UnitsResponse {
  totalCount: number;
  items: UnitItem[];
}

export interface UnitsHRMResponse {
  model: UnitHRMItem[];
}

export async function getAllUnits(isActived?: string): Promise<UnitsResponse> {
  let url = isActived ? `api/units?Active=${isActived}` : "api/units";
  const response = await apiClient.get<UnitsResponse>(url);
  return response.data;
}

export async function getListUnitsFromHrm(): Promise<UnitsHRMResponse> {
  const response = await apiClient.get<UnitsHRMResponse>("api/units/hrm");
  return response.data;
}

export async function postUnit(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/units", data);
  return response.data;
}

export async function putUnit(id: string, data: Partial<any>): Promise<any> {
  const response = await apiClient.put<any>(`api/units/${id}`, data);
  return response.data;
}

export async function deleteUnits(ids: string[]): Promise<void> {
  await apiClient.delete("api/units", {
    data: ids,
  });
}
