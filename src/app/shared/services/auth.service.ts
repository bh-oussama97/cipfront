import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MatriculeVerificationRequestDto } from '../interfaces/matricule-verification-request-dto';
import { UserMatriculeSuccessDto } from '../interfaces/user-matricule-success-dto';
import { Observable } from 'rxjs';
import { UserLoginRequestDto } from '../interfaces/user-login-request-dto';
import { ResponseDto } from '../interfaces/response-dto';
import { UserAccountCreationRequestDto } from '../interfaces/user-account-creation-request-dto';
import { OtpVerificationRequestDto } from '../interfaces/otp-verification-request-dto';
import { UserLoginSuccessDto } from '../interfaces/user-login-success-dto';
import { TokenRefreshRequestDto } from '../interfaces/token-refresh-request-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authApiURL: string;
  private tokenKey = 'cip_token'; // Key for storing token in localStorage
  private isAuthenticatedKey = 'isAuthenticated'; // Key for storing isAuthenticated in localStorage

  private _token: string;
  private _isAuthenticated = false;
  public userArr: any;

  constructor(private http: HttpClient) {
    this.authApiURL = environment.apiUrl + "/auth";
    this._token = localStorage.getItem(this.tokenKey) || '';
    this._isAuthenticated = localStorage.getItem(this.isAuthenticatedKey) === 'true';
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }

  matriculeSignin(matriculeDto: MatriculeVerificationRequestDto): Observable<UserMatriculeSuccessDto> {
    return this.http.post<UserMatriculeSuccessDto>(`${this.authApiURL}/matricule-signin`, matriculeDto);
  }

  userSignin(userLogin: UserLoginRequestDto): Observable<ResponseDto> {
    
    return this.http.post<ResponseDto>(`${this.authApiURL}/login`, userLogin);
  }

  userSignup(userSignupDto: UserAccountCreationRequestDto): Observable<ResponseDto> {
    return this.http.post<ResponseDto>(`${this.authApiURL}/sign-up`, userSignupDto);
  }

  verifyOtp(verifyOtpDto: OtpVerificationRequestDto): Observable<UserLoginSuccessDto> {
    return this.http.post<UserLoginSuccessDto>(`${this.authApiURL}/verify-otp`, verifyOtpDto);
  }

  refreshToken(refreshTokenDto: TokenRefreshRequestDto): Observable<ResponseDto> {
    return this.http.put<ResponseDto>(`${this.authApiURL}/refresh-token`, refreshTokenDto);
  }

  getLoggedInUser(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/users`);
  }

  setToken(token: string) {
    
    this._token = token;
    localStorage.setItem(this.tokenKey, token);
    this._isAuthenticated = true;
    localStorage.setItem(this.isAuthenticatedKey, 'true');
  }

  save_login_info() {
    const userJson = JSON.stringify(this.userArr);
    localStorage.setItem('userJson', userJson);
    this._isAuthenticated = true;
    localStorage.setItem(this.isAuthenticatedKey, 'true');
  }

  get_login_info() {
    const userJson = localStorage.getItem('userJson');
    if (userJson) {
      const jsonArr = JSON.parse(userJson);
      this.userArr = jsonArr;
      this._isAuthenticated = true;
      localStorage.setItem(this.isAuthenticatedKey, 'true');
      return true;
    } else {
      return false;
    }
  }

  removeToken() {
    this._token = '';
    localStorage.removeItem(this.tokenKey);
    this._isAuthenticated = false;
    localStorage.setItem(this.isAuthenticatedKey, 'false');
  }

  logout() {
    localStorage.clear();
    this._token = '';
    this._isAuthenticated = false;
  }

  getToken() {
    return this._token;
  }

}
