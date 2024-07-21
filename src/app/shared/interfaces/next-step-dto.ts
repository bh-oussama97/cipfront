import { Category } from "../enum/category";
import { Decision } from "../enum/decision";
import { IdeaState } from "../enum/idea-state";
import { IdeaType } from "../enum/idea-type";
import { Motif } from "../enum/motif";

export interface NextStepDto {

	ideaId?: string;
	description: String;
	status: IdeaState;
	matricule: string;
	affectedTo: string;
	decision: Decision;
	motif: Motif;
	type: IdeaType;
	category: Category;
	original?: number;
	impact?: number;
	global: boolean;
	valid: boolean;
	total :number;
}
