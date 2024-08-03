import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IdeaService } from '../../services/idea.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { DataService } from '../../services/data.service';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirm-best-idea-dialog',
  templateUrl: './confirm-best-idea-dialog.component.html',
  styleUrls: ['./confirm-best-idea-dialog.component.scss'],
})
export class ConfirmBestIdeaDialogComponent implements OnInit{
  close = faClose;
  isLoading:boolean=false;
  matricule:string;
  constructor(
    public dialogRef: MatDialogRef<ConfirmBestIdeaDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      id: string;
    },
    private ideaService: IdeaService,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private dataService : DataService,
    private authService:AuthService
  ) {}

  ngOnInit(): void {
    this.matricule = this.authService.get_login_info()?.matricule;
  }
  confirmBestIdeaSelection() {
    this.isLoading=true;
    this.ideaService.selectBestIdea(this.data.id).subscribe({
      next: (response: any) => {
        if (!response) {
          this.isLoading = false;
          this.snackbar.open(
            this.translate.instant(
              'ideasContent.bestIdeaSelectionContent.errorMessage'
            ),
            '',
            {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: 'notification-error',
            }
          );
        } else {

          setTimeout(()=>{
            this.isLoading = false;
            this.dialogRef.close();
            this.snackbar
            .open(response, '', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: 'notification-success',
            });
          },2000);
        }
      },
      error: (httpError: HttpErrorResponse) => {
        this.isLoading = false;
        this.snackbar.open(httpError?.message, '', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: 'notification-error',
        });
      },
    });
  }
  closeDialog() {
    this.dataService.transferConfirmValue(false);
    this.dialogRef.close();
  }
}
