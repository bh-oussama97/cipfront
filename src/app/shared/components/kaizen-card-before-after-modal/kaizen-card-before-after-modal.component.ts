import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { FileService } from '../../services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-kaizen-card-before-after-modal',
  templateUrl: './kaizen-card-before-after-modal.component.html',
  styleUrls: ['./kaizen-card-before-after-modal.component.scss']
})
export class KaizenCardBeforeAfterModalComponent {
  thumbnailIcon = faImage;
  filenameImageBefore: string;
  filenameImageAfter: string;
  imageBeforeFile: File;
  imageAfterFile: File;
  close = faClose;
  constructor(
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: { ideaId: string },
    public dialogRef: MatDialogRef<KaizenCardBeforeAfterModalComponent>,
    private snackbar: MatSnackBar
  ) { }

  uploadCardKaizenImageBefore(event: any) {
    this.imageBeforeFile = event.target.files[0];
    const formData = new FormData();
    formData.append('status', 'before');
    formData.append('file', this.imageBeforeFile);
    formData.append('id', this.data.ideaId);
    this.fileService.uploadKaizenCard(formData).subscribe({
      next: (result: any) => {
        this.filenameImageBefore = this.imageBeforeFile.name;
        if (result['message'] != null) {
          this.snackbar
            .open(result['message'], '', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: 'notification-success'
            });
        }
      }, error: (httpError: HttpErrorResponse) => {
        this.snackbar
          .open(httpError.error, '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'notification-error'
          })

      }
    });
  }
  uploadCardKaizenImageAfter(event: any) {
    this.imageAfterFile = event.target.files[0];
    const formData = new FormData();
    formData.append('status', 'after');
    formData.append('file', this.imageAfterFile);
    formData.append('id', this.data.ideaId);
    this.fileService.uploadKaizenCard(formData).subscribe({
      next: (result: any) => {
        if (result['message'] != null) {
          this.filenameImageAfter = this.imageAfterFile.name;
          this.snackbar
            .open(result['message'], '', {
              duration: 3000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: 'notification-success'
            });
        }
      }, error: (httpError: HttpErrorResponse) => {
        this.snackbar
          .open(httpError.error, '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'notification-error'
          });
        
      }
    });
  }

  validateCardBeforeAfterUpload(){    
    if( this.filenameImageAfter === undefined || this.filenameImageBefore === undefined)
    {
      this.snackbar.open('Please upload both images', '',  {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: 'notification-error'
      });
    }
    else{
      this.dialogRef.close();
    }
  }
}
