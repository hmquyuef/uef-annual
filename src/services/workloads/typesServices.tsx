import apiClient from "@/services/apiClient";

export interface WorkloadTypeItem {
  id: string;
  name: string;
  shortName: string;
  href: string;
  workloadGroupId: string;
  groupName: string;
  emails: string;
  position: number;
  totalItems: number;
  infoChart: ItemChart;
  totalApprovedItems: number;
  creationTime: number;
  isActived: boolean;
}

export interface AddUpdateWorkloadType {
  id?: string;
  name: string;
  shortName: string;
  href: string;
  position: number;
  workloadGroupId: string;
  emails: string;
  isActived: boolean;
}

export interface ItemChart {
  categories: number[];
  series: {
    name: string;
    data: number[];
  };
}

export interface WorkloadTypesResponse {
  items: WorkloadTypeItem[];
  totalCount: number;
}

export async function getWorkloadTypes(
  yearId: string
): Promise<WorkloadTypesResponse> {
  let url = `api/workload/types?Years=${yearId}`;
  const response = await apiClient.get<WorkloadTypesResponse>(url);
  return response.data;
}

export async function getWorkloadTypesByHref(
  href: string
): Promise<WorkloadTypesResponse> {
  const response = await apiClient.get<WorkloadTypesResponse>(
    `api/workload/types?Href=${href}`
  );
  return response.data;
}

export async function postAddWorkloadType(
  data: Partial<AddUpdateWorkloadType>
): Promise<AddUpdateWorkloadType> {
  const response = await apiClient.post<AddUpdateWorkloadType>(
    "api/workload/types",
    data
  );
  return response.data;
}

export async function putUpdateWorkloadType(
  id: string,
  data: Partial<AddUpdateWorkloadType>
): Promise<AddUpdateWorkloadType> {
  const response = await apiClient.put<AddUpdateWorkloadType>(
    `api/workload/types/${id}`,
    data
  );
  return response.data;
}

export async function deleteWorkloadTypes(ids: string[]): Promise<void> {
  await apiClient.delete("api/workload/types", {
    data: ids,
  });
}
