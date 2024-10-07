import apiClient from "../apiClient";

export interface Users {
    id: string;
    userName: string;
    fullName: string;
    email: string;
    unitName: string;
    standardNumber: number;
    creationTime: number;
    isActived: boolean;
}

export interface UsersFromHRM {
    id: string;
    userName: string;
    lastName: string;
    middleName: string;
    firstName: string;
    fullName: string;
    fullNameUnsigned: string;
    unitId: string;
    unitName: string;
}
export interface UserActivity{
    id: string;
    userName: string;
    fullName: string;
    email: string;
    unitName: string;
    activitiesIds: string[];
}

export interface UserRole{
    id: string;
    userName: string;
    fullName: string;
    email: string;
    roles: ListRoles[];
}

export interface ListRoles {
    id: string;
    name: string
}

export interface AddUpdateUsersTable {
    id: string;
    userName: string;
    fullName: string;
    email: string;
    unitName: string;
    standardNumber: number;
}

export interface UsersResponse {
    items: Users[];
    totalCount: number;
}

export interface UsersFromHRMResponse {
    items: UsersFromHRM[];
}

export interface UsersACtivitiesResponse {
    items: UserActivity[];
    totalCount: number;
}

export interface UsersRolesResponse {
    items: UserRole[];
}

export async function getListRolesByEmail(mail:string): Promise<UsersRolesResponse> {
    const response = await apiClient.get<UsersRolesResponse>(`api/permission?Filters=${mail}`);
    return response.data;
}

export async function getListUsers(): Promise<UsersResponse> {
    const response = await apiClient.get<UsersResponse>('api/users?PageSizes=9999');
    return response.data;
}

export async function getUsers(code: string): Promise<UsersResponse> {
    const response = await apiClient.get<UsersResponse>(`api/users?PageSizes=500&Filters=${code}`);
    return response.data;
}

export async function getUsersFromHRMbyId(id: string): Promise<UsersFromHRMResponse> {
    const response = await apiClient.get<UsersFromHRMResponse>(`api/users/hrm/${id}`);
    return response.data;
}

export async function getUsersActivities(activityId: string): Promise<UsersACtivitiesResponse> {
    const response = await apiClient.get<UsersACtivitiesResponse>(activityId !== "" ? `api/users/activity?activityId=${activityId}` : "api/users/activity");
    return response.data;
}