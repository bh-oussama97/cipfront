import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { IdeaService } from '../../services/idea.service';
import { NextStepDto } from '../../interfaces/next-step-dto';
import { UserDto } from '../../interfaces/user-dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ResponseDto } from '../../interfaces/response-dto';
import { TaskDto } from '../../interfaces/task-dto';
import { Motif } from '../../enum/motif';
import { Decision } from '../../enum/decision';
import { Router } from '@angular/router';
import { Category } from '../../enum/category';
import { DataService } from '../../services/data.service';
import { IdeaDto } from '../../interfaces/idea-dto';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from '../../services/auth.service';
import { IdeaState } from '../../enum/idea-state';

@Component({
  selector: 'app-select-expert-modal',
  templateUrl: './select-expert-modal.component.html',
  styleUrls: ['./select-expert-modal.component.scss']
})
export class SelectExpertModalComponent implements OnInit{
  close = faClose;
  expertSelected: any;
  connectedUser:UserDto;
  isLoading:boolean=false;
  constructor(@Inject(MAT_DIALOG_DATA) public data:
    {
      expertList: UserDto[],
      impact: number,
      originalite: number,
      generalizable: string,
      valid: string,
      ideaDetails: TaskDto, motif: Motif,
      noteTotal : number,
      ideaDTO : IdeaDto,
      category : Category
    },
    public dialogRef: MatDialogRef<SelectExpertModalComponent>,
    private ideaService: IdeaService,
    private snackbar: MatSnackBar,
    private router : Router,
    private dataservice : DataService,
    private authService : AuthService
  ) {
  }
  ngOnInit(): void {
    this.connectedUser = this.authService.get_login_info();
  }
  confirm() {
    this.isLoading = true;
    const nextStepDto: NextStepDto = {
      ideaId: this.data.ideaDetails.ideaId,
      description: this.data.ideaDetails.description,
      status: IdeaState.SELECTED,
      matricule: this.connectedUser.matricule,
      affectedTo: this.expertSelected.matricule,
      impact: this.data.impact,
      original: this.data.originalite,
      global: this.data.generalizable === 'yes' ? true : false,
      valid: this.data.valid === 'yes' ? true : false,
      type: this.data.ideaDetails.type,
      motif: this.data.motif,
      decision: Decision.SELECTED,
      category: this.data.category,
      total : this.data.noteTotal
    };
    this.ideaService.updateIdeaNextStep(nextStepDto).subscribe({
      next: (response: any) => {
        if (response !== null) {
          setTimeout(()=>{
            this.isLoading = false;
            this.dialogRef.close();
            this.snackbar
              .open("Idea has been assigned to " + this.expertSelected.fullName, '', {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: 'notification-success'
              }).afterDismissed().subscribe((res) => {
                this.dataservice.notifyTaskCompletion();
                this.router.navigateByUrl('/ideas');
              });
          },2000)
 
        }
      }, error: (httpError: HttpErrorResponse) => {
        let responseError: ResponseDto = httpError.error;
        setTimeout(()=>{
          this.isLoading = false;
          this.snackbar
          .open(responseError.message, '', {
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
