import apiClient from "../apiClient";
import { Determinations } from "./Determinations";
import { PaymentApprovedItem } from "./PaymentApprovedItem";

export interface InvigilatorItem {
  id: string;
  userName: string;
  fullName: string;
  unitName: string;
  totalSessions: number;
  standardNumber: number;
  determinations: Determinations;
  payments: PaymentApprovedItem;
  note: string;
}

export interface InvigilatorsResponse {
  items: InvigilatorItem[];
  totalCount: number;
}

export async function getAllInvigilators(
  years?: string
): Promise<InvigilatorsResponse> {
  let url = `api/invigilators?Years=${years}`;
  const response = await apiClient.get<InvigilatorsResponse>(url);
  return response.data;
}

export async function getExportInvigilators(
  unitCode: string,
  yearId: string
): Promise<any> {
  let url = unitCode
    ? `api/invigilators/export?unitCode=${unitCode}&SchoolYearId=${yearId}&FromDate=0&ToDate=0`
    : `api/invigilators/export?SchoolYearId=${yearId}&FromDate=0&ToDate=0`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function getCheckExistInvigilator(
  userName: string
): Promise<boolean> {
  let url = `api/invigilators/checkexist?userName=${userName}`;
  const response = await apiClient.get<boolean>(url);
  return response.data;
}

export async function getExportInvigilator(
  unitCode: string,
  yearId: string
): Promise<any> {
  let url = unitCode
    ? `api/invigilators/export?unitCode=${unitCode}&SchoolYearId=${yearId}&FromDate=0&ToDate=0`
    : `api/invigilators/export?SchoolYearId=${yearId}&FromDate=0&ToDate=0`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function postAddInvigilator(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/invigilators", data);
  return response.data;
}

export async function putUpdateInvigilator(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/invigilators/${id}`, data);
  return response.data;
}

export async function putUpdateApprovedInvigilator(
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`/api/invigilators/approved`, data);
  return response.data;
}

export async function deleteInvigilators(ids: string[]): Promise<void> {
  await apiClient.delete("api/invigilators", {
    data: ids,
  });
}

export async function ImportInvigilators(data: FormData): Promise<any> {
  const response = await apiClient.post<any>("api/invigilators/import", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}
