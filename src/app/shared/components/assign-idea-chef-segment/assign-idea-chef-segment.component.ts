import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NextStepDto } from '../../interfaces/next-step-dto';
import { Router } from '@angular/router';
import { IdeaService } from '../../services/idea.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseDto } from '../../interfaces/response-dto';
import { DataService } from '../../services/data.service';
import { Decision } from '../../enum/decision';
import { Motif } from '../../enum/motif';
import { IdeaState } from '../../enum/idea-state';

@Component({
  selector: 'app-assign-idea-chef-segment',
  templateUrl: './assign-idea-chef-segment.component.html',
  styleUrls: ['./assign-idea-chef-segment.component.scss']
})
export class AssignIdeaChefSegmentComponent {
  isLoading:boolean=false;
constructor(public dialogRef:MatDialogRef<AssignIdeaChefSegmentComponent>,
private router : Router,
private ideaService : IdeaService,
private snackbar : MatSnackBar,
private dataservice : DataService,
@Inject(MAT_DIALOG_DATA) public data
){}
  yes(){
    this.isLoading = true;
    const nextStep: NextStepDto =
    {
      ideaId: this.data.ideaId,
      description: this.data.description,
      matricule: this.data.matricule,
      affectedTo: this.data.matricule,
      decision: Decision.VALIDATED,
      motif: Motif.NONE,
      category: this.data.category,
      status: IdeaState.INPROGRESS,
      original: 0,
      impact: 0,
      total: 0,
      global: false,
      valid: false,
      type: this.data.type 
    }
    this.ideaService.updateIdeaNextStep(nextStep).subscribe(
      {
        next: (response: any) => {
          if (response !== null) {
            setTimeout(()=>{
              this.isLoading = false;
              this.dialogRef.close();
              this.snackbar
              .open("Idea has been preselected !", 'X', {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: 'notif-success'
              }).afterDismissed().subscribe((res) => {
                this.dataservice.notifyTaskCompletion();
                this.router.navigateByUrl('dashboard/ideas');
              });
            },2000);        
          }
        }, error: (httpError: HttpErrorResponse) => {
          let responseError: ResponseDto = httpError.error;
          setTimeout(()=>{
            this.isLoading = false;
            this.snackbar
            .open(responseError.message, 'X', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: 'notification-error'
            });
          },2000)
        }
      });
  }
}
