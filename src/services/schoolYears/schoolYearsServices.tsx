import apiClient from "../apiClient";

export interface SchoolYearsResponses {
  totalCount: number;
  items: [];
}

export async function getAllSchoolYears(): Promise<SchoolYearsResponses> {
  const response = await apiClient.get<SchoolYearsResponses>("api/years");
  return response.data;
}

export async function postSchoolYear(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/years", data);
  return response.data;
}

export async function putSchoolYear(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/years/${id}`, data);
  return response.data;
}

export async function deleteSchoolYears(ids: string[]): Promise<void> {
  await apiClient.delete("api/years", {
    data: ids,
  });
}
