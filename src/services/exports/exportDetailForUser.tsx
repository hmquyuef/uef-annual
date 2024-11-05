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
  admissionCounseling: DetailsItem;
  totalStandarNumber: number;
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
  attendances: number;
  fromDate: number;
  proof: string;
  note: string;
}

export interface ExportDetailForUser {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  unitName: string;
  title: string;
  results: any[];
  totalStandarNumber: number;
}

export interface ResultItemForBM01 {
  semester: string;
  subject: string;
  course: string;
  classCode: string;
  standarNumber: number;
  fromDate: number;
  eventDate: number;
  proof: string;
  note: string;
}

export interface ResultItemForBM02 {
  activityName: string;
  semester: string;
  classCode: string;
  standarNumber: number;
  fromDate: number;
  eventDate: number;
  proof: string;
  note: string;
}

export interface ResultItemForBM03 {
  location: string;
  position: string;
  numberOfTime: number;
  standardNumber: number;
  fromDate: number;
  toDate: number;
  entryDate: number;
  eventDate: number;
  proof: string;
  note: string;
}

export interface ResultItemForBM04 {
  content: string;
  totalStudents: number;
  standarNumber: number;
  fromDate: number;
  eventDate: number;
  proof: string;
  note: string;
}

export interface ResultItemForBM05 {
  activityName: string;
  standarNumber: number;
  fromDate: number;
  eventDate: number;
  proof: string;
  note: string;
}

export async function getDataExportByUserName(
  userName: string,
  startDate: number | null,
  endDate: number | null
): Promise<DetailUserItem> {
  let url = `api/export/${userName}`;
  if (startDate !== null && endDate !== null) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  const response = await apiClient.get<DetailUserItem>(url);
  return response.data;
}

export async function getDataExportByUserNameWithForms(
  userName: string,
  startDate: number | null,
  endDate: number | null,
  forms: string
): Promise<ExportDetailForUser> {
  let url = `api/export/${userName}/${forms}`;
  if (startDate !== null && endDate !== null) {
    url += `?startDate=${startDate}&endDate=${endDate}`;
  }
  const response = await apiClient.get<ExportDetailForUser>(url);
  return response.data;
}
