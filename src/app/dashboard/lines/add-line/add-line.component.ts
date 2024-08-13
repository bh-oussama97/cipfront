import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { StructureType } from 'src/app/shared/enum/structure-type';
import { IFile } from 'src/app/shared/interfaces/file';
import { StructureService } from 'src/app/shared/services/structure.service';

@Component({
  selector: 'app-add-line',
  templateUrl: './add-line.component.html',
  styleUrls: ['./add-line.component.scss']
})
export class AddLineComponent implements OnInit{

  faInformation = faInfoCircle;
  selectedValue: string;
    sites : any[] = ['Sousse','Mateur Sud','Mateur Nord','Manzel Hayet'];
    plants : any[] = ['BMW','VW','AUDI','MS1','MN1','MH1'];
    segments : any[] = ['Cutting & WPA MEB AUTARK','Segment 45','Segment 59','Segment 53-1','Cutting & WPA SYSAPP LTN1','Segment Muster SYSAPP'];
  addLineForm:FormGroup;
  loading : boolean = false;
  constructor(private snackbar:MatSnackBar,
    private translate:TranslateService,
    private fb:FormBuilder,
    private router : Router,
    private structureService: StructureService
    ){}

  ngOnInit(): void {
    this.addLineForm = this.fb.group({
      'plantName' : [''],
      'siteName' : [''],
      'segmentName' : [''],
      'nameLine' : ['']
    })
  }
  addNewLine(){
    this.snackbar
    .open(this.translate.instant('linesContent.addLineForm.successAdd'), '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'notification-success'
    })
    .afterDismissed().subscribe((res)=>{
      this.router.navigateByUrl('lines');
    });
  }
      /**
   * This gets the list of uploaded files from file uploader component
   * @param fileList
   */
      getUploadedFiles(fileList: IFile) {
        this.loading = true;
        const data: FormData = new FormData();
        data.append('file', fileList.value);
        data.append('type', StructureType.SEGMENT);
        this.structureService.excelMassifUpload(data).subscribe({
          next: (response: HttpResponse<any>) => {
            if (response !== null) {
              this.snackbar.open(response['message'], '', {
                duration: 2000,
                horizontalPosition: 'center',
                verticalPosition: 'top',
                panelClass: 'notification-success',
              });
            }
          },
          error: (httpError: HttpErrorResponse) => {
            setTimeout(() => {
              this.loading = false;
              if(httpError.status !== 200)
              { 
                this.snackbar.open(httpError.error, '', {
                  duration: 2000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                  panelClass: 'notification-error',
                });
              }
              else{
                this.snackbar.open(httpError.error.text, '', {
                  duration: 2000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                  panelClass: 'notification-success',
                });
              }
            }, 3000);
          },
        });
      }
}
