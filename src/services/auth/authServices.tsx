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

  export async function postInfoToGetToken(data: Partial<any>): Promise<AuthItem> {
    const response = await apiClient.post<AuthItem>("api/auth/token", data);
    return response.data;
  }