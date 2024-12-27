import apiClient from "../apiClient";
import { AttackmentItem } from "../forms/Attackment";
import { MembersInfomations } from "./membersInfomation";

export interface LecturerRegulationItem {
  id: string;
  eventsOrganizer: string[];
  contents: string;
  documentNumber: string;
  documentDate: number;
  fromDate: number;
  toDate: number;
  entryDate: number;
  members: MembersInfomations[];
  attackment: AttackmentItem;
  note: string;
}

export interface LecturerRegulationsResponse {
  items: LecturerRegulationItem[];
  totalCount: number;
}

export async function getAllLecturerRegulations(
  yearId: string
): Promise<LecturerRegulationsResponse> {
  let url = yearId
    ? `api/general/charity?Years=${yearId}`
    : "api/general/charity";
  const response = await apiClient.get<LecturerRegulationsResponse>(url);
  return response.data;
}

export async function postLecturerRegulation(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/general/charity", data);
  return response.data;
}

export async function putLecturerRegulation(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/general/charity/${id}`, data);
  return response.data;
}

export async function deleteLecturerRegulations(ids: string[]): Promise<void> {
  await apiClient.delete("api/general/charity", {
    data: ids,
  });
}

export async function ImportLecturerRegulations(data: FormData): Promise<any> {
  const response = await apiClient.post<any>(
    "api/general/charity/import",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
