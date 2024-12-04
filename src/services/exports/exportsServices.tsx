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
  data: Partial<any>
): Promise<ExportResponse> {
  const response = await apiClient.post<ExportResponse>(
    "api/export/bm05",
    data
  );
  return response.data;
}
