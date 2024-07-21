import { Profile } from "../enum/profile";
import { Role } from "../enum/role";

export interface UserAccountCreationRequestDto {
    firstName: string;
    lastName: string;
    emailId: string;
    password: string;
    matricule: string;
    profile: Profile;
    role: Role;
}
