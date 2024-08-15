import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { StructureType } from 'src/app/shared/enum/structure-type';
import { IFile } from 'src/app/shared/interfaces/file';
import { ResponseDto } from 'src/app/shared/interfaces/response-dto';
import { SiteDto } from 'src/app/shared/interfaces/site-dto';
import { StructureDto } from 'src/app/shared/interfaces/structure-dto';
import { FileService } from 'src/app/shared/services/file.service';
import { StructureService } from 'src/app/shared/services/structure.service';

@Component({
  selector: 'app-add-plant',
  templateUrl: './add-plant.component.html',
  styleUrls: ['./add-plant.component.scss'],
})
export class AddPlantComponent implements OnInit {
  faInformation = faInfoCircle;
  addPlantForm: FormGroup;
  uploadedLoading: boolean = false;
  sites: SiteDto[] = [];
  siteSelected: string ="";
  displayProgressSpinner:boolean=false;
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService,
    private snackbar: MatSnackBar,
    private router: Router,
    private structureService: StructureService,
    private fileService:FileService
  ) { }
  ngOnInit(): void {
    this.addPlantForm = this.fb.group({
      siteName: [''],
      plantName: [''],
    });
    this.structureService.getAllSites().subscribe((response: SiteDto[]) => {
      this.sites = response.filter(el => el.name !== "");
    })
  }

  addNewPlant() {
    const newPlant: StructureDto = {
      name: this.addPlantForm.value.plantName,
      type: StructureType.PLANT,
      belongsTo: {
        id: this.siteSelected,
        name: null,
        type : null
      },
    };

    if (this.addPlantForm.value.plantName === "") {
      this.snackbar.open(this.translate.instant("plantContent.AddPlant.errorAddingProductSection"), '', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: 'notification-error',
      });
    }
    else if(this.siteSelected === "")
    {
      this.snackbar.open(this.translate.instant("plantContent.AddPlant.selectPlant"), '', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: 'notification-error',
      });
    }
    else{
      this.structureService.createNewStructure(newPlant).subscribe({
        next: (response: any) => {
          this.snackbar
            .open(response.message, '', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: 'notification-success',
            })
            .afterDismissed()
            .subscribe((res) => {
              this.router.navigateByUrl('plants');
            });
        },
        error: (httpError: HttpErrorResponse) => {
          let responseError: ResponseDto = httpError.error;
          this.snackbar.open(responseError.message, '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'notification-error',
          });
        },
      });
    }


  }

  /**
   * This gets the list of uploaded files from file uploader component
   * @param fileList
   */
  getUploadedFiles(files: IFile) {
    this.uploadedLoading = true;
    const data: FormData = new FormData();
    data.append('file', files.value);
    data.append('type', StructureType.PLANT);
    this.fileService.excelMassifUpload(data).subscribe(
      {
        next: (response: HttpResponse<any>) => {          
          if (response.status === 200) {
            this.snackbar.open(response['message'], '', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: 'notification-success',
            });
          }
        }, error: (httpError: HttpErrorResponse) => {
          setTimeout(() => {
            this.uploadedLoading = false;
            if(httpError.status == 417 && typeof httpError.error === 'object')
              {
                let errorMsj = "";
                Object.keys(httpError.error).forEach(row => {
                  let message = httpError.error[row][0];
                  errorMsj += message + "\n";
                });
                this.snackbar.open(errorMsj, '', {
                  duration: 4000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                  panelClass: 'error-notification-message',
                });
              }
              else if( httpError.status == 200)
              {
                this.snackbar.open(httpError.error.text, '', {
                  duration: 2000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                  panelClass: 'notification-success',
                });
              }
              else{
                this.snackbar.open(httpError.error, '', {
                  duration: 4000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                  panelClass: 'error-notification-message',
                });
              }

  
          }, 3000);
        }
      });

  }

  handleLoadingState(isLoading: boolean) {
    this.uploadedLoading = isLoading;
  }
  cancelUpload(event) {

  }
}
