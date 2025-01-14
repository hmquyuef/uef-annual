import apiClient from "../apiClient";
import { Determinations } from "../forms/Determinations";
import { MembersInfomations } from "./membersInfomation";

export interface SchoolLevelItem {
  id: string;
  contents: string;
  eventVenue: string;
  sponsor: string;
  determinations: Determinations;
  members: MembersInfomations[];
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

export async function putListMembersSchoolLevel(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/general/schools/members/${id}`,
    data
  );
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
