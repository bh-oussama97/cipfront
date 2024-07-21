import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StructureDto } from '../interfaces/structure-dto';
import { Observable } from 'rxjs';
import { ResponseDto } from '../interfaces/response-dto';
import { StructureType } from '../enum/structure-type';
import { SiteDto } from '../interfaces/site-dto';

@Injectable({
  providedIn: 'root'
})
export class StructureService {
  private structureApiURL: string;

  constructor(private httpClient:HttpClient) { 
    this.structureApiURL = environment.apiUrl + "/structures"
  }

  createNewStructure(structureDto:StructureDto) : Observable<ResponseDto>{
    return this.httpClient.post<ResponseDto>(this.structureApiURL,structureDto);
  }

  getAllStructuresByType(type:StructureType) :Observable<StructureDto[]>{
    return this.httpClient.get<StructureDto[]>(this.structureApiURL + "/"+type);
  }
  getAllSites(){
    return this.httpClient.get(environment.apiUrl+"/sites");
  }

  addNewSite(newSite:SiteDto){
    return this.httpClient.post(environment.apiUrl+"/sites",newSite);
  }
}
