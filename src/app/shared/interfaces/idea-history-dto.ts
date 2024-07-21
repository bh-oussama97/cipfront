import { Decision } from "../enum/decision";
import { IdeaState } from "../enum/idea-state";

export interface IdeaHistoryDto {
    affectedBy?: string;
	affectedTo?: string;	
	decision?: Decision;
	status?: IdeaState;
	createdAt?: string;
}
