import apiClient from "@/services/apiClient";
import { PaymentApprovedItem } from "./PaymentApprovedItem";

export interface ActivityItem {
  id: string;
  stt: number;
  name: string;
  workloadTypeId: string;
  workloadTypeName: string;
  determinations: Determinations;
  participants: Participation[];
  description: string;
  documentNumber: string;
  payments: PaymentApprovedItem;
  creationTime: number;
  isActived: boolean;
}

export interface Determinations {
  number: string;
  fromDate: number;
  entryDate: number;
  eventDate: number;
  file: InfoFile;
}

export interface InfoFile {
  type: string;
  path: string;
  name: string;
  size: number;
}

export interface Participation {
  id: string;
  userName: string;
  fullName: string;
  unitId: string;
  unitName: number;
  standardNumber: number;
  description: string;
}

export interface AddUpdateActivityItem {
  id?: string;
  stt: number;
  name: string;
  workloadTypeId: string;
  determinations: Determinations;
  participants: ActivityInput[];
  documentNumber: string;
  description: string;
}

export interface ActivityInput {
  id: string;
  userName: string;
  fullName: string;
  unitId: string;
  unitName: string;
  standardNumber: number;
  description: string;
}

export interface ImportResponse {
  totalCount: number;
}

export interface ActivitiesResponse {
  items: ActivityItem[];
  totalCount: number;
}

export async function getAllActivities(
  yearId: string
): Promise<ActivitiesResponse> {
  let url = yearId ? `api/activities?Years=${yearId}` : "api/leaders";
  const response = await apiClient.get<ActivitiesResponse>(url);
  return response.data;
}

export async function getActivityById(id: string): Promise<ActivityItem> {
  const response = await apiClient.get<ActivityItem>(`api/activities/${id}`);
  return response.data;
}

export async function postAddActivity(
  data: Partial<AddUpdateActivityItem>
): Promise<AddUpdateActivityItem> {
  const response = await apiClient.post<AddUpdateActivityItem>(
    "api/activities",
    data
  );
  return response.data;
}

export async function putUpdateActivity(
  id: string,
  data: Partial<AddUpdateActivityItem>
): Promise<AddUpdateActivityItem> {
  const response = await apiClient.put<AddUpdateActivityItem>(
    `api/activities/${id}`,
    data
  );
  return response.data;
}

export async function putUpdateApprovedActivity(
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`/api/activities/approved`, data);
  return response.data;
}

export async function deleteActivities(ids: string[]): Promise<void> {
  await apiClient.delete("api/activities", {
    data: ids,
  });
}

export async function ImportActivities(
  data: FormData
): Promise<ImportResponse> {
  const response = await apiClient.post<ImportResponse>(
    "api/activities/import",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
