import apiClient from "../apiClient";
import { PaymentApprovedItem } from "../forms/PaymentApprovedItem";

export interface LecturerRegulationItem {
  id: string;
  userName: string;
  fullName: string;
  unitName: string;
  notifiedAbsences: number;
  unnotifiedAbsences: number;
  lateEarly: number;
  entryDate: number;
  payments: PaymentApprovedItem;
  note: string;
}

export interface LecturerRegulationsResponse {
  items: LecturerRegulationItem[];
  totalCount: number;
}

export async function getAllLecturerRegulations(
  yearId: string
): Promise<LecturerRegulationsResponse> {
  let url = yearId
    ? `api/regulations/lecturers?Years=${yearId}`
    : "api/regulations/lecturerss";
  const response = await apiClient.get<LecturerRegulationsResponse>(url);
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
