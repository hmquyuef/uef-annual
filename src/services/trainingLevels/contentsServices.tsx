import apiClient from "../apiClient";

// export interface TrainingContentItem {
//   id: string;
//   name: string;
//   startDate: number;
//   endDate: number;
//   location: string;
//   abbreviation: string;
//   note: string;
// }

export async function getAllTrainingContents(yearId: string): Promise<any> {
  let url = `api/training/contents?Years=${yearId}`;
  const response = await apiClient.get<any>(url);
  return response.data;
}

export async function postTrainingContents(data: Partial<any>): Promise<any> {
  const response = await apiClient.post<any>("api/training/contents", data);
  return response.data;
}

export async function putTrainingContents(
  id: string,
  data: Partial<any>
): Promise<any> {
  const response = await apiClient.put<any>(
    `api/training/contents/${id}`,
    data
  );
  return response.data;
}

export async function deleteTrainingContents(ids: string[]): Promise<void> {
  await apiClient.delete("api/training/contents", {
    data: ids,
  });
}
