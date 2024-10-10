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

export async function getDataExportById(id: string, code: string|null): Promise<ExportResponse> {
    let url = code !== null ? `api/export/${id}?unitCode=${code}` : `api/export/${id}`;
    const response = await apiClient.get<ExportResponse>(url);
    return response.data;
}