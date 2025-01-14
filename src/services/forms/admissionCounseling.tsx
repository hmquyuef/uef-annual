import apiClient from "../apiClient";
import { Determinations } from "./Determinations";
import { PaymentApprovedItem } from "./PaymentApprovedItem";

export interface AdmissionCounselingItem {
  id: string;
  userName: string;
  fullName: string;
  unitName: string;
  location: string;
  position: string;
  numberOfTime: number;
  standardNumber: number;
  determinations: Determinations;
  payments: PaymentApprovedItem;
  note: string;
}

export interface AdmissionCounselingResponse {
  items: AdmissionCounselingItem[];
  totalCount: number;
}

export async function getAllAdmissionCounseling(
  yearId: string
): Promise<AdmissionCounselingResponse> {
  let url = yearId
    ? `api/admissions-counseling?Years=${yearId}`
    : "api/leaders";
  const response = await apiClient.get<AdmissionCounselingResponse>(url);
  return response.data;
}

export async function postAddAdmissionCounseling(
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.post<any>("api/admissions-counseling", data);
  return response.data;
}

export async function putUpdateAdmissionCounseling(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/admissions-counseling/${id}`,
    data
  );
  return response.data;
}

export async function putUpdateApprovedAdmissionCounseling(
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `/api/admissions-counseling/approved`,
    data
  );
  return response.data;
}

export async function deleteAdmissionCounseling(ids: string[]): Promise<void> {
  await apiClient.delete("api/admissions-counseling", {
    data: ids,
  });
}

export async function ImportAdmissionCounseling(data: FormData): Promise<any> {
  const response = await apiClient.post<any>(
    "api/admissions-counseling/import",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
