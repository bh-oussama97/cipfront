import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { faFileImage, faUpload } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { catchError, concatMap, debounceTime, of, tap } from 'rxjs';
import { DefaultModalComponent } from 'src/app/shared/components/default-modal/default-modal.component';
import { KaizenCardBeforeAfterModalComponent } from 'src/app/shared/components/kaizen-card-before-after-modal/kaizen-card-before-after-modal.component';
import { Category } from 'src/app/shared/enum/category';
import { Decision } from 'src/app/shared/enum/decision';
import { IdeaState } from 'src/app/shared/enum/idea-state';
import { Motif } from 'src/app/shared/enum/motif';
import { Profile } from 'src/app/shared/enum/profile';
import { IdeaDto } from 'src/app/shared/interfaces/idea-dto';
import { NextStepDto } from 'src/app/shared/interfaces/next-step-dto';
import { ResponseDto } from 'src/app/shared/interfaces/response-dto';
import { UserDto } from 'src/app/shared/interfaces/user-dto';
import { DataService } from 'src/app/shared/services/data.service';
import { IdeaService } from 'src/app/shared/services/idea.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { OpenKaizenImageComponent } from 'src/app/shared/components/open-kaizen-image/open-kaizen-image.component';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-execute-idea',
  templateUrl: './execute-idea.component.html',
  styleUrls: ['./execute-idea.component.scss']
})
export class ExecuteIdeaComponent implements OnInit {

  ideaDetails: IdeaDto;
  faUpload = faUpload;
  faDownload = faFileImage;
  filename: string;
  ideaExecutionForm: FormGroup;
  motifs: string[];
  motifByDefault: string = Motif.NONE;
  connectedUser: UserDto;
  userAffectedTo:UserDto;
  isLoading:boolean=false;
  ideaId:string;
  ideaCreatedDate:any;
  experComment:string;
  constructor(private dataservice: DataService, private fb: FormBuilder,
    private translate: TranslateService,
    private dialogService: ModalService,
  private ideaService:IdeaService,
  private snackbar:MatSnackBar,
  private router : Router,
  private dialog: MatDialog,
  private authService:AuthService,
  private activatedRoute: ActivatedRoute

  ) {
    this.motifs = [Motif.NONE, Motif.INCLEAR_IDEA, Motif.NOT_STANDARD, Motif.RECURRENT_IDEA];
    this.ideaExecutionForm = this.fb.group({
      choice: new FormControl('yes', [Validators.required]),
      motif: new FormControl('', [Validators.required])
    });
    if (this.ideaExecutionForm.get('choice').value === 'yes') {
      this.ideaExecutionForm.controls['motif'].disable();
    }
  }

  ngOnInit(): void {
    this.connectedUser = this.authService.get_login_info();
    this.activatedRoute.paramMap.subscribe({
      next: (params: ParamMap) => {
        this.ideaId = params.get('ideaId');
        if(this.ideaId)
        {
          this.fetchIdeaDetails(this.ideaId);
        }
      },
    });

    this.ideaExecutionForm.valueChanges.pipe(debounceTime(500)).subscribe(async valuechange => {
      if (valuechange.choice === 'no') {
        this.ideaExecutionForm.controls['motif'].enable();
      }
      if (valuechange.choice === 'yes') {
        this.ideaExecutionForm.controls['motif'].disable();
      }
    });
  }
  openKaizenCardModal() {

    this.dialog.open(KaizenCardBeforeAfterModalComponent, 
      {
      data : { ideaId:this.ideaDetails.ideaId
      },
      minWidth: '30%',
      minHeight: 'fit-content',
    }).afterClosed().subscribe((result)=>{
      console.log("result",result);
      
      this.experComment = result.comment;
      this.fetchIdeaDetails(this.ideaId);
    });
  }
  sendChoice() {
    if (this.ideaExecutionForm.valid) {
      if (this.ideaExecutionForm.value.motif === 'NONE') {
        this.dialogService.create(
          {
            component: DefaultModalComponent,
            message: this.translate.instant('ideasContent.ideaSelectionContent.selectPattern'),
            isDeleteConfirmationModal: false,
            width: '30%',
            height: 'fit-content',
            customModalClass: 'alert-modal',
            buttons: [
              {
                type: 'flat',
                text: this.translate.instant('ideasContent.ideaSelectionContent.ok'),
                handler: () => {
                  return true;
                }
              }
            ]
          }
        );
      }
      else if(this.ideaExecutionForm.value.choice === 'no'){
        this.isLoading=true;
        const nextStepRejected : NextStepDto = {
          ideaId: this.ideaDetails.ideaId,
          description: this.ideaDetails.description,
          status: IdeaState.REFUSED,
          matricule: this.connectedUser.matricule,
          affectedTo: this.ideaDetails.matricule,
          type: this.ideaDetails.type,
          motif: this.ideaExecutionForm.value.motif,
          decision: Decision.REJECTED,
          category: Category.NONE,
          original: this.ideaDetails.original,
          impact: this.ideaDetails.impact,
          global: this.ideaDetails.global,
          valid: this.ideaDetails.valid,
          total: this.ideaDetails.total,
          comment:""
        };
      this.ideaService.updateIdeaNextStep(nextStepRejected).subscribe(
        {
          next: (response: any) => {
            if(response !== null)
              {
                setTimeout(()=>{
                  this.isLoading=false;
                  this.snackbar
                  .open(this.translate.instant("ideasContent.ideaSelectionContent.ideaRejectionMessage"), '', {
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
              this.isLoading=false;
              this.snackbar
              .open(responseError.message, '', {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: 'notification-error'
              });
            },2000)
         
          }
    }
      );
      }
      else if(
        this.ideaExecutionForm.value.choice === 'yes' &&
        (this.ideaDetails.kaizanBefore === null && this.ideaDetails.kaizanAfter === null) )
      {
        this.snackbar
        .open(this.translate.instant('ideasContent.ideaSelectionContent.selectImageBeforeAfter'), 'X', {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: 'notification-error'
        });
      }
      else{
        this.isLoading = true;
        const nextStepAccepted : NextStepDto = {
          ideaId: this.ideaDetails.ideaId,
          description: this.ideaDetails.description,
          status: IdeaState.EXECUTED,
          matricule: this.connectedUser.matricule,
          affectedTo: this.userAffectedTo.matricule,
          type: this.ideaDetails.type,
          motif: Motif.NONE,
          decision: Decision.EXECUTED,
          category: this.ideaDetails.category,
          original: this.ideaDetails.original,
          impact: this.ideaDetails.impact,
          global: this.ideaDetails.global,
          valid: this.ideaDetails.valid,
          total: this.ideaDetails.total,
          comment: this.experComment
        };
        this.ideaService.updateIdeaNextStep(nextStepAccepted).subscribe({
          next: (response: any) => {
            if (response !== null) {
              setTimeout(()=>{
                this.isLoading=false;
                this.snackbar
                .open(this.translate.instant("ideasContent.ideaSelectionContent.ideaExecutionMessage"), '', {
                  duration: 2000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                  panelClass: 'notification-success'
                }).afterDismissed().subscribe((res) => {
                  this.dataservice.notifyTaskCompletion();
                  this.router.navigateByUrl('/ideas');
                });
              },2000);
            }
          }, error: (httpError: HttpErrorResponse) => {
            let responseError: ResponseDto = httpError.error;
            setTimeout(()=>{
              this.isLoading=false;
              this.snackbar
              .open(responseError.message, '', {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: 'notification-error'
              })
              .afterDismissed().subscribe((res) => {
                this.router.navigateByUrl('/ideas');
              });
            },2000)
          }
        })
      }
    }
    else {
      this.dialogService.create(
        {
          component: DefaultModalComponent,
          message: this.translate.instant('ideasContent.ideaSelectionContent.checkAllFields'),
          isDeleteConfirmationModal: false,
          width: '30%',
          height: 'fit-content',
          customModalClass: 'alert-modal',
          buttons: [
            {
              type: 'stroked',
              text: this.translate.instant('ideasContent.ideaSelectionContent.ok'),
              handler: () => {
                return true;
              }
            }
          ]
        }
      );
    }

  }

  getKaizenImageByName(name:string)
  {
    this.dialog.open(OpenKaizenImageComponent,
      {
        data: {
          kaizenImage: name
        },
        minWidth: '40%',
        minHeight: 'fit-content',
        panelClass: 'custom-modalbox'
      });
  }

  fetchIdeaDetails(ideaId:string)
  {
    this.ideaService
    .getIdeaById(ideaId)
    .pipe(
      catchError((error) => {
        setTimeout(() => {
          this.snackbar.open(error.message, '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'notification-error',
          });
        }, 2000);
        return of(null);
      }),
      tap((ideaDto: any) => {
        this.ideaDetails = ideaDto;
        this.ideaCreatedDate = DateTime.fromISO(this.ideaDetails.createdAt,{zone:'utc'}).setZone('Africa/Tunis').toFormat("dd/MM/yyyy hh:mm a");
      }),
      concatMap(() =>
        this.ideaService.getResponsiblesListByEmployeeMatriculeAndRole(
          this.ideaDetails.matricule,
          Profile.CHEF_SEGMENT,
          this.ideaDetails.category
        )
      )
    )
    .subscribe((opexUserList: UserDto[]) => {
      if (opexUserList.length > 0 )
        {
          this.userAffectedTo = opexUserList[0];        
        }
    });

  }

}
