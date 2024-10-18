import apiClient from "../apiClient";

export interface RoleItem {
  id: string;
  name: string;
  appName: string;
  isActived: boolean;
}

export interface AddUpdateRoleItem {
  name: string;
  appId: string;
  isActived: boolean;
}

export interface RoleResponses {
  totalCount: number;
  items: RoleItem[];
}

export async function getAllRoles(): Promise<RoleResponses> {
  const response = await apiClient.get<RoleResponses>("api/roles");
  return response.data;
}
export async function postAddRole(
  data: Partial<AddUpdateRoleItem>
): Promise<AddUpdateRoleItem> {
  const response = await apiClient.post<AddUpdateRoleItem>("api/roles", data);
  return response.data;
}

export async function putUpdateRole(
  id: string,
  data: Partial<AddUpdateRoleItem>
): Promise<AddUpdateRoleItem> {
  const response = await apiClient.put<AddUpdateRoleItem>(
    `api/roles/${id}`,
    data
  );
  return response.data;
}

export async function deleteRoles(ids: string[]): Promise<void> {
  await apiClient.delete("api/roles", {
    data: ids,
  });
}
