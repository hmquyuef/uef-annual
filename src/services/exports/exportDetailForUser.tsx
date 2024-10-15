import apiClient from "../apiClient";

export interface DetailUserItem {
  // title: string;
  // results: any;
  id: string;
  userName: string;
  email: string;
  fullName: string;
  unitName: string;
  activities: DetailsItem;
  classLeaders: DetailsItem;
  assistants: DetailsItem;
  qAs: DetailsItem;
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
  attendances: number;
  proof: string;
  note: string;
}

export interface ResultItemForBM02 {
  activityName: string;
  semester: string;
  classCode: string;
  standarNumber: number;
  attendances: number;
  proof: string;
  note: string;
}

export interface ResultItemForBM04 {
  content: string;
  totalStudents: number;
  standarNumber: number;
  attendances: number;
  proof: string;
  note: string;
}

export interface ResultItemForBM05 {
  activityName: string;
  standarNumber: number;
  attendances: number;
  proof: string;
  note: string;
}

// export async function getDataExportByUserName(
//   unitId: string,
//   userName: string,
//   year: string
// ): Promise<DetailUserItem> {
//   const response = await apiClient.get<DetailUserItem>(
//     `api/export/${unitId}/${userName}/${year}`
//   );
//   return response.data;
// }

export async function getDataExportByUserName(
  userName: string,
  year: string
): Promise<DetailUserItem> {
  const response = await apiClient.get<DetailUserItem>(
    `api/export/${userName}/${year}`
  );
  return response.data;
}

// export async function getDataExportByUserNameWithForms(
//   unitId: string,
//   userName: string,
//   year: string,
//   forms:string
// ): Promise<ExportDetailForUser> {
//   const response = await apiClient.get<ExportDetailForUser>(
//     `api/export/${unitId}/${userName}/${year}/${forms}`
//   );
//   return response.data;
// }

export async function getDataExportByUserNameWithForms(
  userName: string,
  year: string,
  forms:string
): Promise<ExportDetailForUser> {
  const response = await apiClient.get<ExportDetailForUser>(
    `api/export/${userName}/${year}/${forms}`
  );
  return response.data;
}
