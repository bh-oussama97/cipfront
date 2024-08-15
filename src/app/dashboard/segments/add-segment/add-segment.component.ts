import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { StructureType } from 'src/app/shared/enum/structure-type';
import { FileService } from 'src/app/shared/services/file.service';

@Component({
  selector: 'app-add-segment',
  templateUrl: './add-segment.component.html',
  styleUrls: ['./add-segment.component.scss'],
})
export class AddSegmentComponent implements OnInit {
  faInformation = faInfoCircle;
  addSegmentForm: FormGroup;
  selectedValue: string;
  sites: any[] = ['Sousse', 'Mateur Sud', 'Mateur Nord', 'Manzel Hayet'];
  plants: any[] = ['BMW', 'VW', 'AUDI', 'MS1', 'MN1', 'MH1'];
  loading: boolean = false;
  constructor(
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private fb: FormBuilder,
    private router: Router,
    private fileService : FileService
  ) { }
  ngOnInit(): void {
    this.addSegmentForm = this.fb.group({
      site: ['', [Validators.required]],
      plant: ['', [Validators.required]],
      segmentName: ['', [Validators.required]],
      linesNumber: [0, [Validators.required]],
    });
  }
  addNewSegment() {
    this.snackbar
      .open(
        this.translate.instant('segementsContent.addSegmentForm.successAdd'),
        '',
        {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'notification-success',
        }
      )
      .afterDismissed()
      .subscribe((res) => {
        this.router.navigateByUrl('segments');
      });
  }
  /**
   * This gets the list of uploaded files from file uploader component
   * @param fileList
   */
  getUploadedFiles(fileList: any) {
    this.loading = true;
    const data: FormData = new FormData();
    data.append('file', fileList.value);
    data.append('type', StructureType.SEGMENT);
    this.fileService.excelMassifUpload(data).subscribe({
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
      },
    });
  }
}
