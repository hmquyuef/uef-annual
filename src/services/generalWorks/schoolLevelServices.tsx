import apiClient from "../apiClient";
import { AttackmentItem } from "../forms/Attackment";
import { MembersInfomations } from "./membersInfomation";

export interface SchoolLevelItem {
  id: string;
  contents: string;
  documentNumber: string;
  internalNumber: string;
  documentDate: number;
  fromDate: number;
  toDate: number;
  entryDate: number;
  eventVenue: string;
  sponsor: string
  members: MembersInfomations[];
  attackment: AttackmentItem;
  note: string;
}

export interface SchoolLevelsResponse {
  items: SchoolLevelItem[];
  totalCount: number;
}

export async function getAllSchoolLevels(
  yearId: string
): Promise<SchoolLevelsResponse> {
  let url = yearId
    ? `api/general/schools?Years=${yearId}`
    : "api/general/schools";
  const response = await apiClient.get<SchoolLevelsResponse>(url);
  return response.data;
}

export async function postSchoolLevel(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/general/schools", data);
  return response.data;
}

export async function putSchoolLevel(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/general/schools/${id}`, data);
  return response.data;
}

export async function deleteSchoolLevels(ids: string[]): Promise<void> {
  await apiClient.delete("api/general/schools", {
    data: ids,
  });
}

export async function ImportSchoolLevels(data: FormData): Promise<any> {
  const response = await apiClient.post<any>(
    "api/general/schools/import",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
