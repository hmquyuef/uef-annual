import apiClient from "../apiClient";
import { Determinations } from "./Determinations";
import { ImportResponse } from "./formsServices";
import { PaymentApprovedItem } from "./PaymentApprovedItem";
export interface ClassLeaderItem {
  id: string;
  userName: string;
  fullName: string;
  unitName: string;
  semester: string;
  subject: string;
  course: string;
  classCode: string;
  standardNumber: number;
  determinations: Determinations;
  payments: PaymentApprovedItem;
  note: string;
}

export interface ClassLeadersResponse {
  items: ClassLeaderItem[];
  totalCount: number;
}

export async function getAllClassLeaders(
  years?: string
): Promise<ClassLeadersResponse> {
  let url = years ? `api/leaders?Years=${years}` : "api/leaders";
  const response = await apiClient.get<ClassLeadersResponse>(url);
  return response.data;
}

export async function getExportClassLeader(
  unitCode: string,
  yearId: string
): Promise<any> {
  let url = unitCode
    ? `api/leaders/export?unitCode=${unitCode}&SchoolYearId=${yearId}&FromDate=0&ToDate=0`
    : `api/leaders/export?SchoolYearId=${yearId}&FromDate=0&ToDate=0`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function postAddClassLeader(
  data: Partial<ClassLeaderItem>
): Promise<ClassLeaderItem> {
  const response = await apiClient.post<ClassLeaderItem>("api/leaders", data);
  return response.data;
}

export async function putUpdateClassLeader(
  id: string,
  data: Partial<ClassLeaderItem>
): Promise<ClassLeaderItem> {
  const response = await apiClient.put<ClassLeaderItem>(
    `api/leaders/${id}`,
    data
  );
  return response.data;
}

export async function putUpdateApprovedClassLeader(
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`/api/leaders/approved`, data);
  return response.data;
}

export async function deleteClassLeaders(ids: string[]): Promise<void> {
  await apiClient.delete("api/leaders", {
    data: ids,
  });
}

export async function ImportClassLeaders(
  data: FormData
): Promise<ImportResponse> {
  const response = await apiClient.post<ImportResponse>(
    "api/leaders/import",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
