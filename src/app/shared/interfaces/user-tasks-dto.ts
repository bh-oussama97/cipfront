import { TaskDto } from "./task-dto";

export interface UserTasksDto {
    matricule?: string;
    roles?: string[];
    tasks?: TaskDto[];
}
