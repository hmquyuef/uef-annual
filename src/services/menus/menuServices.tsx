import apiClient from "../apiClient";

export interface MenuItem {
  id: string;
  position: string;
  icon: string;
  label: string;
  isChildren: boolean;
  href: string;
  isActived: boolean;
  creationTime: number;
  children: ChildrenItem[];
}
export interface ChildrenItem {
  position: string;
  label: string;
  href: string;
  iconChildren: string;
  isActived: boolean;
}

export interface AddUpdateMenu {
  id?: string
  position: string,
  icon: string,
  label: string,
  isChildren: boolean,
  isActived: boolean,
  children: AddUpdateMenuItem[]
}
export interface AddUpdateMenuItem {
  position: string;
  label: string;
  href: string;
  iconChildren: string;
  isActived: boolean;
}

export interface MenuResponse {
  items: MenuItem[];
  totalCount: number;
}

export async function getAllMenus(): Promise<MenuResponse> {
  const response = await apiClient.get<MenuResponse>("api/menu");
  return response.data;
}

export async function postAddMenu(
  data: Partial<AddUpdateMenu>
): Promise<AddUpdateMenu> {
  const response = await apiClient.post<AddUpdateMenu>("api/menu", data);
  return response.data;
}

export async function putUpdateMenu(
  id: string,
  data: Partial<AddUpdateMenu>
): Promise<AddUpdateMenu> {
  const response = await apiClient.put<AddUpdateMenu>(
    `api/menu/${id}`,
    data
  );
  return response.data;
}

export async function deleteMenus(ids: string[]): Promise<void> {
  await apiClient.delete("api/menu", {
    data: ids,
  });
}
