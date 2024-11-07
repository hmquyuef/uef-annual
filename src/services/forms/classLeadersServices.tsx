import apiClient from "../apiClient";
import { ImportResponse } from "./formsServices";
import {PaymentApprovedItem} from "./PaymentApprovedItem";
export interface ClassLeaderItem {
  id: string;
  userName: string;
  fullName: string;
  unitName: string;
  semester: string;
  course: string;
  subject: string;
  classCode: string;
  standardNumber: number;
  fromDate: number;
  entryDate: number;
  eventDate: number;
  payments: PaymentApprovedItem;
  proof: string;
  note: string;
}

export interface ClassLeadersResponse {
  items: ClassLeaderItem[];
  totalCount: number;
}

export async function getAllClassLeaders(): Promise<ClassLeadersResponse> {
  const response = await apiClient.get<ClassLeadersResponse>("api/leaders");
  return response.data;
}

export async function postAddClassLeader(
  data: Partial<ClassLeaderItem>
): Promise<ClassLeaderItem> {
  const response = await apiClient.post<ClassLeaderItem>("api/leaders", data);
  return response.data;
}

export async function putUpdateClassLeader(
  id: string,
  data: Partial<ClassLeaderItem>
): Promise<ClassLeaderItem> {
  const response = await apiClient.put<ClassLeaderItem>(
    `api/leaders/${id}`,
    data
  );
  return response.data;
}

export async function putUpdateApprovedClassLeader(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `/api/leaders/approved/${id}`,
    data
  );
  return response.data;
}

export async function deleteClassLeaders(ids: string[]): Promise<void> {
  await apiClient.delete("api/leaders", {
    data: ids,
  });
}

export async function ImportClassLeaders(
  data: FormData
): Promise<ImportResponse> {
  const response = await apiClient.post<ImportResponse>(
    "api/leaders/import",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
