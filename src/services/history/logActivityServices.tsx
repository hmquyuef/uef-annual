import apiClient from "../apiClient";

export interface LogActivityItem {
  id: string;
  username: string;
  functionName: string;
  method: string;
  path: string;
  query: string;
  ip: string;
  requestBody: string;
  statusCode: number;
  elapsedTime: number;
  creationTime: number;
}

export interface LogActivityResponses {
  totalCount: number;
  items: LogActivityItem[];
}

export async function getAllLogActivities(
  years: string
): Promise<LogActivityResponses> {
  let url = `api/log-activity?Years=${years}`;
  const response = await apiClient.get<LogActivityResponses>(url);
  return response.data;
}

export async function deleteLogActivities(ids: string[]): Promise<void> {
  await apiClient.delete("api/log-activity", {
    data: ids,
  });
}
