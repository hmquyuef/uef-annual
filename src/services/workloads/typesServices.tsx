import apiClient from "@/services/apiClient";

export interface WorkloadTypeItem {
    id: string;
    name: string;
    shortName: string;
    href: string;
    workloadGroupId: string;
    groupName: string;
    emails: string;
    totalItems: number;
    creationTime: number;
    isActived: boolean;
}

export interface AddUpdateWorkloadType {
    id?: string;
    name: string;
    shortName: string;
    href: string;
    workloadGroupId: string;
    emails: string;
    isActived: boolean;
}

export interface WorkloadTypesResponse {
    items: WorkloadTypeItem[];
    totalCount: number;
}

export async function getWorkloadTypes(): Promise<WorkloadTypesResponse> {
    const response = await apiClient.get<WorkloadTypesResponse>('api/workload/types');
    return response.data;
}

export async function getWorkloadTypesByShortName(shortName: string): Promise<WorkloadTypesResponse> {
    const response = await apiClient.get<WorkloadTypesResponse>((`api/workload/types?Filters=${shortName}`));
    return response.data;
}

export async function getWorkloadTypeById(id: string): Promise<WorkloadTypeItem> {
    const response = await apiClient.get<WorkloadTypeItem>(`api/workload/types/${id}`);
    return response.data;
}

export async function postAddWorkloadType(data: Partial<AddUpdateWorkloadType>): Promise<AddUpdateWorkloadType> {
    const response = await apiClient.post<AddUpdateWorkloadType>('api/workload/types', data);
    return response.data;
}

export async function putUpdateWorkloadType(id: string, data: Partial<AddUpdateWorkloadType>): Promise<AddUpdateWorkloadType> {
    const response = await apiClient.put<AddUpdateWorkloadType>(`api/workload/types/${id}`, data);
    return response.data;
}

export async function deleteWorkloadTypes(ids: string[]): Promise<void> {
    await apiClient.delete('api/workload/types', {
        data: ids
    });
}