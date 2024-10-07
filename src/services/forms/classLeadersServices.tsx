import apiClient from "../apiClient";

export interface ClassLeaderItem {
  id: string;
  userName: string;
  middleName: string;
  firstName: string;
  fullName: string;
  unitName: string;
  semester: string;
  course: string;
  subject: string;
  classCode: string;
  standardNumber: number;
  proof: string;
  note: string;
}

export interface ClassLeadersResponse {
  items: ClassLeaderItem[];
  totalCount: number;
}

export interface AddUpdateClassLeaderItem {
  id: string;
  userName: string;
  middleName: string;
  firstName: string;
  unitName: string;
  semester: string;
  subject: string;
  course: string;
  classCode: string;
  standardNumber: number;
  proof: string;
  note: string;
}

export async function getAllClassLeaders(): Promise<ClassLeadersResponse> {
  const response = await apiClient.get<ClassLeadersResponse>("api/leaders");
  return response.data;
}

export async function postAddClassLeader(
  data: Partial<AddUpdateClassLeaderItem>
): Promise<AddUpdateClassLeaderItem> {
  const response = await apiClient.post<AddUpdateClassLeaderItem>(
    "api/leaders",
    data
  );
  return response.data;
}

export async function putUpdateClassLeader(
  id: string,
  data: Partial<AddUpdateClassLeaderItem>
): Promise<AddUpdateClassLeaderItem> {
  const response = await apiClient.put<AddUpdateClassLeaderItem>(
    `api/leaders/${id}`,
    data
  );
  return response.data;
}

export async function deleteClassLeaders(ids: string[]): Promise<void> {
  await apiClient.delete("api/leaders", {
    data: ids,
  });
}
