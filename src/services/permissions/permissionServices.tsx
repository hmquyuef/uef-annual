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
  userId: string;
  appId: string;
  roleIds: string[];
  isActived: boolean;
}

export interface PermissionResponses {
  totalCount: number;
  items: PermissionItem[];
}

export async function getAllPermissions(): Promise<PermissionResponses> {
  const response = await apiClient.get<PermissionResponses>("api/permission");
  return response.data;
}
export async function postAddPermission(
  data: Partial<AddUpdatePermissionItem>
): Promise<AddUpdatePermissionItem> {
  const response = await apiClient.post<AddUpdatePermissionItem>(
    "api/permission",
    data
  );
  return response.data;
}

export async function putUpdatePermission(
  id: string,
  data: Partial<AddUpdatePermissionItem>
): Promise<AddUpdatePermissionItem> {
  const response = await apiClient.put<AddUpdatePermissionItem>(
    `api/permission/${id}`,
    data
  );
  return response.data;
}

export async function deletePermissions(ids: string[]): Promise<void> {
  await apiClient.delete("api/permission", {
    data: ids,
  });
}
