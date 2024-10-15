import apiClient from "../apiClient";

export interface DataExport {
  stt: number;
  userName: string;
  middleName: string;
  firstName: string;
  faculityName: string;
  activityName: string;
  standNumber: number;
  determination: string;
  note: string;
}

export interface ExportResponse {
  unitName: string;
  data: DataExport[];
}

export async function getDataExportByUnitCode(
  code: string | null,
  startDate: number | null,
  endDate: number | null
): Promise<ExportResponse> {
  let url = "api/export";
  if (code !== null) {
    url += `?unitCode=${code}`;
  }
  if (startDate !== null) {
    url +=
      code !== null
        ? `&startDate=${startDate}&endDate=${endDate}`
        : `?startDate=${startDate}&endDate=${endDate}`;
  }

  const response = await apiClient.get<ExportResponse>(url);
  return response.data;
}
