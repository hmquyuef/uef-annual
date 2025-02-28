import apiClient from "../apiClient";
import { Determinations } from "./Determinations";
import { PaymentApprovedItem } from "./PaymentApprovedItem";

export interface QAItem {
  id: string;
  userName: string;
  fullName: string;
  unitName: string;
  contents: string;
  totalStudent: number;
  standardNumber: number;
  determinations: Determinations;
  payments: PaymentApprovedItem;
  note: string;
}

export interface QAResponse {
  items: QAItem[];
  totalCount: number;
}

export async function getAllQAs(yearId: string): Promise<QAResponse> {
  let url = yearId ? `api/qae?Years=${yearId}` : "api/qae";
  const response = await apiClient.get<QAResponse>(url);
  return response.data;
}

export async function getExportQAs(
  unitCode: string,
  yearId: string
): Promise<any> {
  let url = unitCode
    ? `api/qae/export?unitCode=${unitCode}&SchoolYearId=${yearId}&FromDate=0&ToDate=0`
    : `api/qae/export?SchoolYearId=${yearId}&FromDate=0&ToDate=0`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function postAddQA(data: Partial<QAItem>): Promise<QAItem> {
  const response = await apiClient.post<QAItem>("api/qae", data);
  return response.data;
}

export async function putUpdateQA(
  id: string,
  data: Partial<QAItem>
): Promise<QAItem> {
  const response = await apiClient.put<QAItem>(`api/qae/${id}`, data);
  return response.data;
}

export async function putUpdateApprovedQA(data: Partial<any>): Promise<any> {
  const response = await apiClient.put<any>(`/api/qae/approved`, data);
  return response.data;
}

export async function deleteQAs(ids: string[]): Promise<void> {
  await apiClient.delete("api/qae", {
    data: ids,
  });
}

export async function ImportQAs(data: FormData): Promise<any> {
  const response = await apiClient.post<any>("api/qae/import", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
