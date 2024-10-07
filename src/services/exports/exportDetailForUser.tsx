import apiClient from "../apiClient";

export interface DetailUserItem {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  unitName: string;
  activities: DetailsItem;
  classLeaders: DetailsItem;
  assistants: DetailsItem;
  qAs: DetailsItem;
}

export interface DetailsItem {
  name: string;
  shortName: number;
  totalItems: string;
  items: Item[];
}

export interface Item {
  activityName: string;
  standarNumber: number;
  proof: string;
  note: string;
}

export async function getDataExportByUserName(unitId: string,  userName: string, year: string): Promise<DetailUserItem> {
  const response = await apiClient.get<DetailUserItem>(`api/export/${unitId}/${userName}/${year}`);
  return response.data;
}
