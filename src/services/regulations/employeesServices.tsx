import apiClient from "../apiClient";
import { PaymentApprovedItem } from "../forms/PaymentApprovedItem";

export interface EmployeesRegulationItem {
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

export interface EmployeesRegulationsResponse {
  items: EmployeesRegulationItem[];
  totalCount: number;
}

export async function getAllEmployeesRegulations(
  yearId: string
): Promise<EmployeesRegulationsResponse> {
  let url = yearId
    ? `api/regulations/employees?Years=${yearId}`
    : "api/regulations/employees";
  const response = await apiClient.get<EmployeesRegulationsResponse>(url);
  return response.data;
}

export async function postEmployeesRegulation(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/regulations/employees", data);
  return response.data;
}

export async function putEmployeesRegulation(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/regulations/employees/${id}`,
    data
  );
  return response.data;
}

export async function putApprovedgetEmployeesRegulation(
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `/api/regulations/employees/approved`,
    data
  );
  return response.data;
}

export async function deleteEmployeesRegulations(ids: string[]): Promise<void> {
  await apiClient.delete("api/regulations/employees", {
    data: ids,
  });
}

export async function ImportEmployeesRegulations(data: FormData): Promise<any> {
  const response = await apiClient.post<any>(
    "api/regulations/employees/import",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
