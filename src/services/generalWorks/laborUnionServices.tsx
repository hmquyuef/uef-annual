import apiClient from "../apiClient";
import { Determinations } from "../forms/Determinations";
import { MembersInfomations } from "./membersInfomation";

export interface LaborUnionItem {
  id: string;
  contents: string;
  eventVenue: string;
  sponsor: string;
  determinations: Determinations;
  members: MembersInfomations[];
  note: string;
}

export interface LaborUnionsResponse {
  items: LaborUnionItem[];
  totalCount: number;
}

export async function getAllLaborUnions(
  yearId: string
): Promise<LaborUnionsResponse> {
  let url = yearId
    ? `api/general/union/labor?Years=${yearId}`
    : "api/general/union/labor";
  const response = await apiClient.get<LaborUnionsResponse>(url);
  return response.data;
}

export async function postLaborUnion(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/general/union/labor", data);
  return response.data;
}

export async function putLaborUnion(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/general/union/labor/${id}`,
    data
  );
  return response.data;
}

export async function putListMembersLaborUnion(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/general/union/labor/members/${id}`,
    data
  );
  return response.data;
}

export async function deleteLaborUnions(ids: string[]): Promise<void> {
  await apiClient.delete("api/general/union/labor", {
    data: ids,
  });
}

export async function ImportLaborUnions(data: FormData): Promise<any> {
  const response = await apiClient.post<any>(
    "api/general/union/labor/import",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

// export async function ImportLaborUnions(data: FormData): Promise<any> {
//   const response = await apiClient.post<any>(
//     "api/general/union/labor/import",
//     data,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );

//   return response.data;
// }
