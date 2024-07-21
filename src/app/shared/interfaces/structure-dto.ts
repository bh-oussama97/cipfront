import { StructureType } from "../enum/structure-type";

export interface StructureDto {
    id?:string;
    name:string;
    type : StructureType;
    belongsTo? : StructureDto | null;
}
