import apiClient from "../apiClient";
import { PaymentApprovedItem } from "../forms/PaymentApprovedItem";

export interface LaborRegulationItem {
  id: string;
  userName: string;
  fullName: string;
  unitName: string;
  attendanceDays: number;
  attendanceHours: number;
  lateArrivals: number;
  earlyDepartures: number;
  unexcusedAbsences: number;
  leaveDays: number;
  maternityLeaveDays: number;
  unpaidLeaveDays: number;
  businessTripDays: number;
  missedFingerprint: number;
  entryDate: number;
  payments: PaymentApprovedItem;
  note: string;
}

export interface LaborRegulationsResponse {
  items: LaborRegulationItem[];
  totalCount: number;
}

export async function getAllLaborRegulations(
  yearId: string
): Promise<LaborRegulationsResponse> {
  let url = yearId
    ? `api/regulations/labors?Years=${yearId}`
    : "api/regulations/labors";
  const response = await apiClient.get<LaborRegulationsResponse>(url);
  return response.data;
}

export async function postLaborRegulation(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/regulations/labors", data);
  return response.data;
}

export async function putLaborRegulation(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/regulations/labors/${id}`,
    data
  );
  return response.data;
}

export async function putApprovedgetLaborRegulation(
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `/api/regulations/labors/approved`,
    data
  );
  return response.data;
}

export async function deleteLaborRegulations(ids: string[]): Promise<void> {
  await apiClient.delete("api/regulations/labors", {
    data: ids,
  });
}

export async function ImportLaborRegulations(data: FormData): Promise<any> {
  const response = await apiClient.post<any>(
    "api/regulations/labors/import",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
