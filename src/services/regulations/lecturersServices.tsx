import apiClient from "../apiClient";
import { Determinations } from "../forms/Determinations";
import { PaymentApprovedItem } from "../forms/PaymentApprovedItem";

export interface LecturerRegulationItem {
  id: string;
  userName: string;
  fullName: string;
  unitName: string;
  notifiedAbsences: number;
  unnotifiedAbsences: number;
  lateEarly: number;
  determinations: Determinations;
  payments: PaymentApprovedItem;
  histories: HistoryLecturersItem[];
  note: string;
}

export interface HistoryLecturersItem {
  notifiedAbsences: number;
  unnotifiedAbsences: number;
  lateEarly: number;
  entryDate: number;
}

export interface LecturerRegulationsResponse {
  items: LecturerRegulationItem[];
  totalCount: number;
}

export async function getAllLecturerRegulations(
  yearId: string
): Promise<LecturerRegulationsResponse> {
  let url = `api/regulations/lecturers?Years=${yearId}`;
  const response = await apiClient.get<LecturerRegulationsResponse>(url);
  return response.data;
}

export async function getExportLecturers(
  unitCode: string,
  yearId: string
): Promise<any> {
  let url = unitCode
    ? `api/regulations/lecturers/export?unitCode=${unitCode}&SchoolYearId=${yearId}&FromDate=0&ToDate=0`
    : `api/regulations/lecturers/export?SchoolYearId=${yearId}&FromDate=0&ToDate=0`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function getCheckExistLecturerRegulations(
  userName: string
): Promise<boolean> {
  let url = `api/regulations/lecturers/checkexist?userName=${userName}`;
  const response = await apiClient.get<boolean>(url);
  return response.data;
}

export async function postLecturerRegulation(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/regulations/lecturers", data);
  return response.data;
}

export async function putLecturerRegulation(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/regulations/lecturers/${id}`,
    data
  );
  return response.data;
}

export async function putApprovedgetLecturerRegulation(
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `/api/regulations/lecturers/approved`,
    data
  );
  return response.data;
}

export async function deleteLecturerRegulations(ids: string[]): Promise<void> {
  await apiClient.delete("api/regulations/lecturers", {
    data: ids,
  });
}

export async function ImportLecturerRegulations(data: FormData): Promise<any> {
  const response = await apiClient.post<any>(
    "api/regulations/lecturers/import",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
