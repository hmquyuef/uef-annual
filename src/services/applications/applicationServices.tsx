import apiClient from "../apiClient";

export interface ApplicationItem {
    id: string;
    name: string;
    description: string;
    isActived: boolean;
}

export interface ApplicationResponses {
    totalCount: number;
    items: ApplicationItem[];
}

export async function getAllApplications(): Promise<ApplicationResponses> {
    const response = await apiClient.get<ApplicationResponses>('api/app');
    return response.data;
}