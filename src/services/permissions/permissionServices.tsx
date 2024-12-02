import apiClient from "../apiClient";

export interface PermissionItem {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  appName: string;
  roles: RolePermissionItem[];
  creationTime: number;
  isActived: boolean;
}

export interface RolePermissionItem {
  id: string;
  name: string;
}

export interface AddUpdatePermissionItem {
  id?: string;
  userName: string;
  appId: string;
  roleIds: string[];
  isActived: boolean;
}

export interface PermissionResponses {
  totalCount: number;
  items: [];
}

export async function getAllPermissions(): Promise<PermissionResponses> {
  const response = await apiClient.get<PermissionResponses>("api/permission");
  return response.data;
}
export async function postAddPermission(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/permission", data);
  return response.data;
}

export async function putUpdatePermission(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/permission/${id}`, data);
  return response.data;
}

export async function deletePermissions(ids: string[]): Promise<void> {
  await apiClient.delete("api/permission", {
    data: ids,
  });
}
