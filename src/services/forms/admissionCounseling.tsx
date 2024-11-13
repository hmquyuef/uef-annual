import apiClient from "../apiClient";
import { AttackmentItem } from "./Attackment";
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
  fromDate: number;
  toDate: number;
  entryDate: number;
  documentDate: number;
  attackment: AttackmentItem;
  payments: PaymentApprovedItem;
  proof: string;
  note: string;
}

export interface AdmissionCounselingResponse {
  items: AdmissionCounselingItem[];
  totalCount: number;
}

export async function getAllAdmissionCounseling(): Promise<AdmissionCounselingResponse> {
  const response = await apiClient.get<AdmissionCounselingResponse>(
    "api/admissions-counseling"
  );
  return response.data;
}

export async function postAddAdmissionCounseling(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/admissions-counseling", data);
  return response.data;
}

export async function putUpdateAdmissionCounseling(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/admissions-counseling/${id}`, data);
  return response.data;
}

export async function putUpdateApprovedAdmissionCounseling(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `/api/admissions-counseling/approved/${id}`,
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
  const response = await apiClient.post<any>("api/admissions-counseling/import", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}
