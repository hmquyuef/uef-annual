import apiClient from "../apiClient";

export interface LogActivityItem {
  id: string;
  username: string;
  functionName: string;
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

export async function getAllLogActivities(): Promise<LogActivityResponses> {
  const response = await apiClient.get<LogActivityResponses>(
    "api/log-activity"
  );
  return response.data;
}

export async function deleteLogActivities(ids: string[]): Promise<void> {
  await apiClient.delete("api/log-activity", {
    data: ids,
  });
}
