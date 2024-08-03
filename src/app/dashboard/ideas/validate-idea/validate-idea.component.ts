import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, Subscription } from 'rxjs';
import { DefaultModalComponent } from 'src/app/shared/components/default-modal/default-modal.component';
import { Category } from 'src/app/shared/enum/category';
import { Decision } from 'src/app/shared/enum/decision';
import { IdeaState } from 'src/app/shared/enum/idea-state';
import { Motif } from 'src/app/shared/enum/motif';
import { Profile } from 'src/app/shared/enum/profile';
import { IdeaDto } from 'src/app/shared/interfaces/idea-dto';
import { NextStepDto } from 'src/app/shared/interfaces/next-step-dto';
import { ResponseDto } from 'src/app/shared/interfaces/response-dto';
import { UserDto } from 'src/app/shared/interfaces/user-dto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { IdeaService } from 'src/app/shared/services/idea.service';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-validate-idea',
  templateUrl: './validate-idea.component.html',
  styleUrls: ['./validate-idea.component.scss']
})
export class ValidateIdeaComponent implements OnInit {
  ideaDetails: IdeaDto;
  subscription: Subscription;
  description: string;
  categories: string[];
  motifs: string[];
  ideaValidationForm: FormGroup;
  motifByDefault: string = Motif.NONE;
  categoryByDefault: string = Category.NONE;
  connectedUser: UserDto;
  userAffectedTo: UserDto;
  isLoading:boolean=false;
  ideaId:string;
  constructor(private dataservice: DataService, private fb: FormBuilder,
    private dialogService: ModalService,
    private translate: TranslateService,
    private ideaService: IdeaService,
    private snackbar: MatSnackBar,
    private router: Router,
    private authService:AuthService,
    private activatedRoute : ActivatedRoute
  ) {
    this.motifs = [Motif.NONE, Motif.INCLEAR_IDEA, Motif.NOT_STANDARD, Motif.RECURRENT_IDEA];
    this.categories = [Category.NONE, Category.ASSEMBLY, Category.CUTTING, Category.MAINTENANCE,Category.MATERIAL_HANDLING,Category.PACKAGING,Category.QUALITY,Category.SHE,Category.TESTING,Category.VCM,Category.VISUAL_MANAGMEMENT,Category.WAP];
    this.ideaValidationForm = this.fb.group({
      choice: ['yes'],
      motif: new FormControl({ value: null, disabled: false }),
      category: null
    });
    if (this.ideaValidationForm.get('choice').value === 'yes') {
      this.ideaValidationForm.controls['motif'].disable();
    }
    this.ideaValidationForm.valueChanges.pipe(debounceTime(500)).subscribe(async valuechange => {

      if (valuechange.choice === 'no') {
        this.ideaValidationForm.controls['motif'].enable();
      }
      if (valuechange.choice === 'yes') {
        this.ideaValidationForm.controls['motif'].disable();
      }
    });
  }


  ngOnInit(): void {
    this.connectedUser = this.authService.get_login_info();
    this.activatedRoute.paramMap.subscribe({
      next: (params: ParamMap) => {
        this.ideaId = params.get('ideaId');
      },
    });
    this.getIdeaById(this.ideaId );
    console.log("this.ideaDetail",this.ideaDetails);
    
    // this.subscription = this.dataservice.currentMessage$.subscribe({
    //   next: (message: any) => {
    //     this.ideaDetails = message;
    //     this.description = message.description;
    //   }
    // });
    this.ideaService.getResponsiblesListByEmployeeMatriculeAndRole(this.connectedUser.matricule, Profile.CHEF_SEGMENT)
      .subscribe((responsibles: UserDto[]) => {
        if (responsibles.length > 0) {
          this.userAffectedTo = responsibles[0];          
        }
      });
  }

  sendChoice() {
    this.isLoading = true;
    if (this.ideaValidationForm.value.choice === 'yes') {
      const nextStep: NextStepDto =
      {
        ideaId: this.ideaDetails.IdeaId,
        description: this.ideaDetails.description,
        matricule: this.connectedUser.matricule,
        affectedTo: this.userAffectedTo.matricule,
        decision: Decision.PRESELECTED,
        motif: Motif.NONE,
        category: this.ideaValidationForm.value.category,
        status: IdeaState.PRESELECTED,
        original: 0,
        impact: 0,
        total: 0,
        global: false,
        valid: false,
        type: this.ideaDetails.type 
      }
      this.dialogService.create({
        component: DefaultModalComponent,
        isDeleteConfirmationModal: false,
        width: '40%',
        height: 'fit-content',
        customModalClass: 'alert-modal',
        message: this.translate.instant('ideasContent.ideaValidationContent.confimAssignIdeaDialogText'),
        buttons: [
          {
            type: 'flat',
            text: this.translate.instant('ideasContent.ideaValidationContent.yes'),
            handler: () => {
              this.ideaService.updateIdeaNextStep(nextStep).subscribe(
                {
                  next: (response: any) => {
                    if (response !== null) {
                      this.isLoading = false;
                      this.snackbar
                        .open("Idea has been preselected !", '', {
                          duration: 2000,
                          horizontalPosition: 'right',
                          verticalPosition: 'top',
                          panelClass: 'notification-success'
                        }).afterDismissed().subscribe((res) => {
                          this.dataservice.notifyTaskCompletion();
                          this.router.navigateByUrl('/ideas');
                        });
                    }
                  }, error: (httpError: HttpErrorResponse) => {
                    let responseError: ResponseDto = httpError.error;
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
                  }
                });
              return true;
            }
          },
          {
            type: 'stroked',
            text: this.translate.instant('ideasContent.ideaValidationContent.no'),
            handler: () => {
              return true;
            }
          }
        ]
      });
    }
    if (this.ideaValidationForm.value.choice === 'no') {
      const rejectionStep: NextStepDto =
      {
        ideaId: this.ideaDetails.IdeaId,
        description: this.ideaDetails.description,
        matricule: this.connectedUser.matricule,
        affectedTo: this.ideaDetails.affectedTo,
        decision: Decision.REJECTED,
        motif: this.ideaValidationForm.value.motif,
        category: this.ideaValidationForm.value.category,
        status: IdeaState.REFUSED,
        original: 0,
        impact: 0,
        global: false,
        valid: false,
        type: this.ideaDetails.type,
        total: 0
      };
      this.dialogService.create({
        component: DefaultModalComponent,
        isDeleteConfirmationModal: false,
        width: '35%',
        height: 'fit-content',
        customModalClass: 'alert-modal',
        message: this.translate.instant('ideasContent.ideaValidationContent.rejectAssignIdeaDialogText'),
        buttons: [
          {
            type: 'flat',
            text: this.translate.instant('ideasContent.ideaValidationContent.yes'),
            handler: () => {
              this.ideaService.updateIdeaNextStep(rejectionStep).subscribe(
                {
                
                  next: (response: any) => {
                    if (response !== null) {
                      this.snackbar
                        .open("Idea has been rejected !", '', {
                          duration: 2000,
                          horizontalPosition: 'right',
                          verticalPosition: 'top',
                          panelClass: 'notification-error'
                        }).afterDismissed().subscribe((res) => {
                          this.dataservice.notifyTaskCompletion();
                          this.router.navigateByUrl('/ideas');
                        });;
                    }
                  }, error: (httpError: HttpErrorResponse) => {
                    let responseError: ResponseDto = httpError.error;
                    this.snackbar
                      .open(responseError.message, '', {
                        duration: 2000,
                        horizontalPosition: 'right',
                        verticalPosition: 'top',
                        panelClass: 'notification-error'
                      })
                      .afterDismissed().subscribe((res) => {
                        this.router.navigateByUrl('/dashboard/ideas');
                      });
                  }
                });
              return true;
            }
          },
          {
            type: 'stroked',
            text: this.translate.instant('ideasContent.ideaValidationContent.no'),
            handler: () => {
              return true;
            }
          }
        ]
      });
    }

  }
  getIdeaById(ideaId: string) {
    this.ideaService.getIdeaById(ideaId).subscribe((response: IdeaDto) => {
      this.ideaDetails = response;
      console.log("this.ideaDetails",this.ideaDetails);
      
    });
  }

  // ngOnDestroy(): void {
  //   this.dataservice.clearObject();
  // }
}
