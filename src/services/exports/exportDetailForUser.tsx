import apiClient from "../apiClient";
import { AttackmentItem } from "../forms/Attackment";
import { GeneralItems } from "./GeneralItems";
import { OtherItems } from "./OtherItems";
import { RegulationItems } from "./RegulationItems";
import { TrainingItems } from "./TrainingItems";

export interface DetailUserItem {
  userName: string;
  email: string;
  fullName: string;
  unitName: string;
  items: {
    other: OtherItems[];
    general: GeneralItems[];
    regulation: RegulationItems;
    training: TrainingItems;
  };
  totalEvents: number;
  note: string;
}

export interface DefaultItem {
  name: string;
  shortName: string;
  totalItems: number;
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
  fromDate: number;
  toDate: number;
  entryDate: number;
  documentDate: number;
  file: AttackmentItem;
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
  toDate: number;
  entryDate: number;
  documentDate: number;
  proof: string;
  note: string;
}

export interface ResultItemForBM02 {
  activityName: string;
  semester: string;
  classCode: string;
  standarNumber: number;
  fromDate: number;
  toDate: number;
  entryDate: number;
  documentDate: number;
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
  documentDate: number;
  proof: string;
  note: string;
}

export interface ResultItemForBM04 {
  content: string;
  totalStudents: number;
  standarNumber: number;
  fromDate: number;
  toDate: number;
  entryDate: number;
  documentDate: number;
  proof: string;
  note: string;
}

export interface ResultItemForBM05 {
  activityName: string;
  standarNumber: number;
  fromDate: number;
  toDate: number;
  entryDate: number;
  eventDate: number;
  proof: string;
  note: string;
}

export async function getDataExportByUserName(
  data: Partial<any>
): Promise<DetailUserItem> {
  const response = await apiClient.post<DetailUserItem>("api/export", data);
  return response.data;
}

export async function getDataExportByUserNameWithForms(
  data: Partial<any>
): Promise<ExportDetailForUser> {
  const response = await apiClient.post<ExportDetailForUser>(
    "api/export/forms",
    data
  );
  return response.data;
}
