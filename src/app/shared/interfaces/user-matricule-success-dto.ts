import { UserDto } from "./user-dto";

export interface UserMatriculeSuccessDto {
    accessToken:string;
    refreshToken:string;
    matricule:string;
    reponsable:UserDto[];
    structure:string;
}
