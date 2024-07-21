import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { StructureType } from 'src/app/shared/enum/structure-type';
import { IFile } from 'src/app/shared/interfaces/file';
import { ResponseDto } from 'src/app/shared/interfaces/response-dto';
import { StructureDto } from 'src/app/shared/interfaces/structure-dto';
import { StructureService } from 'src/app/shared/services/structure.service';


@Component({
  selector: 'app-add-plant',
  templateUrl: './add-plant.component.html',
  styleUrls: ['./add-plant.component.scss']
})
export class AddPlantComponent implements OnInit {

  faInformation = faInfoCircle;
  addPlantForm: FormGroup;
  sites: any[] = ['Sousse', 'Mateur Sud', 'Mateur Nord', 'Manzel Hayet'];

  constructor(private fb: FormBuilder,
    private translate: TranslateService,
    private snackbar: MatSnackBar,
    private router: Router,
    private structureService: StructureService
  ) {
  }
  ngOnInit(): void {
    this.addPlantForm = this.fb.group({
      siteName: [''],
      plantName: ['']
    });
  }


  addNewPlant() {
    const newPlant: StructureDto = {
      name: this.addPlantForm.value.plantName,
      type: StructureType.PLANT,
      belongsTo: {
        "name": null,
        "type": null,
        "id": null
      }
    };
    this.structureService.createNewStructure(newPlant).subscribe({
      next: (response: any) => {
        this.snackbar
          .open(response.message, 'X', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'notif-success'
          })
          .afterDismissed().subscribe((res) => {
            this.router.navigateByUrl('/dashboard/plants');
          });
      }, error: (httpError: HttpErrorResponse) => {
        let responseError: ResponseDto = httpError.error;
        this.snackbar
          .open(responseError.message, 'X', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'notification-error'
          });
      },
    })

  }

  /**
 * This gets the list of uploaded files from file uploader component
 * @param fileList
 */
  getUploadedFiles(fileList: IFile[]) {
      if(fileList.length > 0)
      {
      this.snackbar
        .open(this.translate.instant('plantContent.AddPlant.successAdd'), 'X', {
          duration: 2000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'notif-success'
        })
        .afterDismissed().subscribe((res) => {
          this.router.navigateByUrl('/dashboard/plants');
        });
    }
  }

}
