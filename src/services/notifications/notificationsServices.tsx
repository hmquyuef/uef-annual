import apiClient from "../apiClient";

export interface NotificationResponses {
  totalCount: number;
  items: [];
}

export async function getAllNotifications(
  username: string
): Promise<NotificationResponses> {
  let url = `api/notifications/${username}`;
  const response = await apiClient.get<NotificationResponses>(url);
  return response.data;
}

export async function postNotification(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/notifications", data);
  return response.data;
}

export async function putNotification(ids: string[]): Promise<any> {
  const response = await apiClient.put<any>(`api/notifications/read`, ids);
  return response.data;
}

export async function deleteNotifications(ids: string[]): Promise<void> {
  await apiClient.delete("api/notifications", {
    data: ids,
  });
}
