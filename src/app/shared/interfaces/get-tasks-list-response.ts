import { TaskDto } from "./task-dto";

export interface GetTasksListResponse {
    matricule:string;
    roles :string[];
    tasks:TaskDto[];
}
