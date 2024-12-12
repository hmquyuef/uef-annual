import apiClient from "../apiClient";

export interface WorkloadGroupItem {
  id: string;
  name: string;
  description: string;
  creationTime: number;
  isActived: boolean;
}

export interface WorkloadGroupResponse {
  items: WorkloadGroupItem[];
  totalCount: number;
}

export async function getWorkloadGroups(): Promise<WorkloadGroupResponse> {
  const response = await apiClient.get<WorkloadGroupResponse>(
    "api/workload/groups"
  );
  return response.data;
}

export async function postAddWorkloadGroup(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/workload/groups", data);
  return response.data;
}

export async function putUpdateWorkloadGroup(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(`api/workload/groups/${id}`, data);
  return response.data;
}

export async function deleteWorkloadGroup(ids: string[]): Promise<void> {
  await apiClient.delete("api/workload/groups", {
    data: ids,
  });
}
