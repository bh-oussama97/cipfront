import { Category } from "../enum/category";
import { Decision } from "../enum/decision";
import { IdeaState } from "../enum/idea-state";
import { IdeaType } from "../enum/idea-type";
import { Motif } from "../enum/motif";
import { IdeaHistoryDto } from "./idea-history-dto";

export interface IdeaDto {

	ideaId: string;
    description: string;  
    status?:  IdeaState;
	matricule?: string;
	affectedTo?: string;
	decision?: Decision;
	motif?: Motif;
	category: Category;
	type?: IdeaType;
	createdAt?: string;
	global?: boolean;
	valid?: boolean;
	original?: number;
	impact?: number;
	total?: number;
	kaizanBefore? : string;
	kaizanAfter? :string;
	kaizen?:string;
	segment?:string | null;
	line?:string;
	contreMaitre?:string;
	chefSegment?:string;
	expert?:string;
	/* Historiques*/
	histories : IdeaHistoryDto[];
}
