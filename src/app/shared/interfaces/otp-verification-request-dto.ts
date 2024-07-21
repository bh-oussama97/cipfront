import { Context } from "../enum/context";

export interface OtpVerificationRequestDto {
    emailId:string;
    oneTimePassword:number;
    context : Context;
}
