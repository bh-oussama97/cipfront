import { IdeaState } from "../enum/idea-state";
import { IdeaType } from "../enum/idea-type";
import { Motif } from "../enum/motif";
import { ResponsableDto } from "./responsable-dto";

export interface TaskDto {
    ideaId?: string;
    description?: string;
    processId?: string;
    taskId?:  string;    
    status?:  IdeaState;
    createdAt?: Date;
    fullName?: string;
    phone?: string;
    employee?: string;
    motif?: Motif;
    type?: IdeaType;
    segment?: string;
    line?: string;
    responsables : ResponsableDto[];
    contreMaitre?:string;
    chefSegment?:string;
    expert?:string;
    sequence?:string;
}
