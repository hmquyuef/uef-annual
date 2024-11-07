import apiClient from "../apiClient";

export interface RoleItem {
  id: string;
  name: string;
  appName: string;
  displayRole: DisplayRoleItem;
  isActived: boolean;
}

export interface DisplayRoleItem {
  isRead: boolean;
  isCreate: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  isExport: boolean;
  isImport: boolean;
  isConfirm: boolean;
  isApprove: boolean;
  isReject: boolean;
}

export interface RoleResponses {
  totalCount: number;
  items: RoleItem[];
}

export async function getAllRoles(): Promise<RoleResponses> {
  const response = await apiClient.get<RoleResponses>("api/roles");
  return response.data;
}

export async function getRoleByName(name: string): Promise<RoleResponses> {
  let url = `api/roles?Filters=${name}`;
  const response = await apiClient.get<RoleResponses>(url);
  return response.data;
}

export async function postAddRole(data: Partial<RoleItem>): Promise<RoleItem> {
  const response = await apiClient.post<RoleItem>("api/roles", data);
  return response.data;
}

export async function putUpdateRole(
  id: string,
  data: Partial<RoleItem>
): Promise<RoleItem> {
  const response = await apiClient.put<RoleItem>(`api/roles/${id}`, data);
  return response.data;
}

export async function deleteRoles(ids: string[]): Promise<void> {
  await apiClient.delete("api/roles", {
    data: ids,
  });
}
