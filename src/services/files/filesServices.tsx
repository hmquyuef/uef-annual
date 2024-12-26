import apiClient from "../apiClient";

export interface FileInfoItem {
  type: string;
  name: string;
  size: number;
  contents: FileInfoItem[];
}

export interface FileInfoResponse {
  totalDriveSize: number;
  freeSpace: number;
  size: number;
  contents: FileInfoItem[];
}

export async function getFilesInfo(): Promise<FileInfoResponse> {
  const response = await apiClient.get<FileInfoResponse>("api/files/info");
  return response.data;
}