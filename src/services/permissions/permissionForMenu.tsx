import apiClient from "../apiClient";

export interface PermissionForMenu {
  id?: string;
  userName: string;
  roleId: string;
  roleName: string;
  permissions: PermissionForMenuItem[];
}

export interface PermissionForMenuItem {
  position: string;
  icon: string;
  label: string[];
  isChildren: boolean;
  children: ChildrenItem[];
}

export interface ChildrenItem {
  position: string;
  label: string;
  href: string;
  iconChildren: string;
  isActived: boolean;
}

export interface PermissionForMenuResponses {
  totalCount: number;
  items: PermissionForMenu[];
}
export async function getAllPermissionsForMenu(): Promise<PermissionForMenuResponses> {
  let url = "api/permission-menu";
  const response = await apiClient.get<PermissionForMenuResponses>(url);
  return response.data;
}

export async function getAllPermissionsForMenuByUserName(userName: string): Promise<PermissionForMenuResponses> {
  let url = `api/permission-menu?Filters=${userName}`;
  const response = await apiClient.get<PermissionForMenuResponses>(url);
  return response.data;
}

export async function postAddPermissionForMenu(
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.post<any>("api/permission-menu", data);
  return response.data;
}

export async function putUpdatePermissionForMenu(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/permission-menu/${id}`, data);
  return response.data;
}

export async function deletePermissionsForMenu(userNames: string[]): Promise<void> {
  await apiClient.delete("api/permission-menu", {
    data: userNames,
  });
}
