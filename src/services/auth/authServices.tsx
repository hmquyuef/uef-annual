import apiClient from "../apiClient";

export async function postInfoToGetToken(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/auth/token", data);
  return response.data;
}

export async function getExpiresInTokenByRefresh(
  refresh: string
): Promise<any> {
  let url = `api/auth/expires/${refresh}`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function putTokenByRefresh(refresh: string): Promise<any> {
  let url = `api/auth/refresh/${refresh}`;
  try {
    const response = await apiClient.put<any>(url);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return null;
  }
}

export async function deleteToken(token: string): Promise<void> {
  let url = `api/auth/destroy?token=${token}`;
  await apiClient.delete(url);
}
