import apiClient from "../apiClient";

export interface AuthItem {
  userName: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  issuedAt: number;
  expiresAt: number;
}

export interface AddUpdateAuthItem {
  userName: string;
  password: string;
  email: string;
  provider: string;
}

export async function postInfoToGetToken(
  data: Partial<any>
): Promise<AuthItem> {
  const response = await apiClient.post<AuthItem>("api/auth/token", data);
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
