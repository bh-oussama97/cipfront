import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { IdeaCreationRequestDto } from '../interfaces/idea-creation-request-dto';
import { HttpClient } from '@angular/common/http';
import { ResponseDto } from '../interfaces/response-dto';
import { Observable } from 'rxjs';
import { GetTasksListResponse } from '../interfaces/get-tasks-list-response';
import { IdeaDto } from '../interfaces/idea-dto';
import { NextStepDto } from '../interfaces/next-step-dto';
import { UserDto } from '../interfaces/user-dto';
import { UserTasksDto } from   '../interfaces/user-tasks-dto';
import { RankDto } from '../interfaces/rank-dto';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private ideaApiURL: string;

  constructor(private http: HttpClient) {
    this.ideaApiURL = environment.apiUrl + "/ideas"
  }

  createNewIdea(ideaRequest: IdeaCreationRequestDto) {
    return this.http.post<ResponseDto>(this.ideaApiURL, ideaRequest);
  }

  getListOfIdeasAffectedByRegistrationNumber(registrationNumber: string): Observable<GetTasksListResponse> {
    return this.http.get<GetTasksListResponse>(environment.apiUrl + '/tasks/' + registrationNumber);
  }

  updateIdeaNextStep(nextStepDto: NextStepDto): Observable<IdeaDto> {
    return this.http.post<IdeaDto>(environment.apiUrl + '/nextStep', nextStepDto);
  }

  getResponsiblesListByEmployeeMatriculeAndRole(matricule: string, role: string): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(environment.apiUrl + "/users/responsables/" + matricule + "/" + role);
  }

  getIdeaById(id: string): Observable<IdeaDto> {
    return this.http.get<IdeaDto>(environment.apiUrl + "/ideas/" + id);
  }

  getIdeasListByResponsible(matricule: string): Observable<UserTasksDto> {
    return this.http.get<UserTasksDto>(environment.apiUrl + '/ideas_resp/' + matricule);

  }

  getRakingIdeas(): Observable<RankDto[]> {
    return this.http.get<RankDto[]>(environment.apiUrl + '/ranking');
  }
}
