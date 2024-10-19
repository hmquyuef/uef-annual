import apiClient from "../apiClient";

export interface MenuItem {
  id: string;
  position: string;
  icon: string;
  lable: string;
  isChildren: boolean;
  href: string;
  isActived: boolean;
  creationTime: number;
  children: ChildrenItem[];
}
export interface ChildrenItem {
  position: string;
  lable: string;
  href: string;
}

export interface AddUpdateMenuItem {
    position: string;
    lable: string;
    href: string;
  }

export interface MenuResponse {
  items: MenuItem[];
  totalCount: number;
}

export async function getAllMenus(): Promise<MenuResponse> {
  const response = await apiClient.get<MenuResponse>("api/menu");
  return response.data;
}

export async function deleteMenus(ids: string[]): Promise<void> {
    await apiClient.delete("api/menu", {
      data: ids,
    });
  }
