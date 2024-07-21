import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';
import { FileService } from '../../services/file.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-import-kaizen-card-modal',
  templateUrl: './import-kaizen-card-modal.component.html',
  styleUrls: ['./import-kaizen-card-modal.component.scss']
})
export class ImportKaizenCardModalComponent implements OnInit {

  file: File;
  filename: string;
  faAttachment = faPaperclip;
  isLoading: boolean = false;
  constructor(public dialogRef: MatDialogRef<ImportKaizenCardModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data:
      {
        ideaId: string
      },
    private fileservice: FileService,
    private snackbar: MatSnackBar

  ) { }
  ngOnInit(): void {
  }
  uploadCardKaizen(event: any) {
    this.file = event.target.files[0];
    this.filename = this.file.name;
  }
  closeModal() {
    this.isLoading = true;
    const formData = new FormData();
    formData.append('id', this.data.ideaId);
    formData.append('file', this.file);
    formData.append('status', 'kaizen');
    if (this.fileservice.isValidSize(this.file.size) === false) {
      setTimeout(() => {
        this.isLoading = false;
        this.snackbar
          .open("File size should minimum than 2MB", 'X', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'notification-error'
          })
      }, 2000);
    }
    else {
      this.fileservice.uploadKaizenCard(formData).subscribe(
        {
          next: (result: any) => {
            setTimeout(() => {
              this.isLoading = false;
              this.snackbar
                .open(result['message'], 'X', {
                  duration: 2000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                  panelClass: 'notif-success'
                });
              this.dialogRef.close({ filename: this.filename });
            }, 2000);

          }, error: (httpError: HttpErrorResponse) => {
            setTimeout(() => {
              this.isLoading = false;
              this.snackbar
                .open(httpError.error, 'X', {
                  duration: 3000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                  panelClass: 'notification-error'
                })
            }, 2000);
          }
        });
    }
  }
}
