import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DefaultModalComponent } from 'src/app/shared/components/default-modal/default-modal.component';
import { Category } from 'src/app/shared/enum/category';
import { Decision } from 'src/app/shared/enum/decision';
import { IdeaState } from 'src/app/shared/enum/idea-state';
import { Motif } from 'src/app/shared/enum/motif';
import { Profile } from 'src/app/shared/enum/profile';
import { NextStepDto } from 'src/app/shared/interfaces/next-step-dto';
import { ResponseDto } from 'src/app/shared/interfaces/response-dto';
import { UserDto } from 'src/app/shared/interfaces/user-dto';
import { DataService } from 'src/app/shared/services/data.service';
import { IdeaService } from 'src/app/shared/services/idea.service';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-validate-idea',
  templateUrl: './validate-idea.component.html',
  styleUrls: ['./validate-idea.component.scss']
})
export class ValidateIdeaComponent implements OnInit, OnDestroy {
  ideaDetails: any;
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
  constructor(private dataservice: DataService, private fb: FormBuilder,
    private dialogService: ModalService,
    private translate: TranslateService,
    private ideaService: IdeaService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    this.motifs = [Motif.NONE, Motif.INCLEAR_IDEA, Motif.NOT_STANDARD, Motif.RECURRENT_IDEA];
    this.categories = [Category.NONE, Category.ASSEMBLY, Category.CUTTING, Category.MAINTENANCE,Category.MATERIAL_HANDLING,Category.PACKAGING,Category.QUALITY,Category.SHE,Category.TESTING,Category.VCM,Category.VISUAL_MANAGMEMENT,Category.WAP];
  }


  ngOnInit(): void {
    this.connectedUser = JSON.parse(localStorage.getItem('userJson'));
    this.ideaValidationForm = this.fb.group({
      choice: ['no'],
      motif: new FormControl({ value: null, disabled: false }),
      category: null
    });
    this.subscription = this.dataservice.currentMessage$.subscribe({
      next: (message: any) => {
        this.ideaDetails = message;
        this.description = message.description;
      }
    });
    this.ideaService.getResponsiblesListByEmployeeMatriculeAndRole(this.ideaDetails.employee, Profile.CHEF_SEGMENT)
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
        ideaId: this.ideaDetails.ideaId,
        description: this.ideaDetails.description,
        matricule: this.connectedUser.matricule,
        affectedTo: this.userAffectedTo.matricule,
        decision: Decision.VALIDATED,
        motif: Motif.NONE,
        category: this.ideaValidationForm.value.category,
        status: IdeaState.INPROGRESS,
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
                        .open("Idea has been preselected !", 'X', {
                          duration: 2000,
                          horizontalPosition: 'right',
                          verticalPosition: 'top',
                          panelClass: 'notif-success'
                        }).afterDismissed().subscribe((res) => {
                          this.dataservice.notifyTaskCompletion();
                          this.router.navigateByUrl('dashboard/ideas');
                        });
                    }
                  }, error: (httpError: HttpErrorResponse) => {
                    let responseError: ResponseDto = httpError.error;
                    this.snackbar
                      .open(responseError.message, 'X', {
                        duration: 2000,
                        horizontalPosition: 'right',
                        verticalPosition: 'top',
                        panelClass: 'notification-error'
                      })
                      .afterDismissed().subscribe((res) => {
                        this.router.navigateByUrl('dashboard/ideas');
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
        ideaId: this.ideaDetails.ideaId,
        description: this.ideaDetails.description,
        matricule: this.connectedUser.matricule,
        affectedTo: this.ideaDetails.employee,
        decision: Decision.REJECTED,
        motif: this.ideaValidationForm.value.motif,
        category: this.ideaValidationForm.value.category,
        status: IdeaState.CLOSED,
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
                        .open("Idea has been rejected !", 'X', {
                          duration: 2000,
                          horizontalPosition: 'right',
                          verticalPosition: 'top',
                          panelClass: 'notification-warning'
                        }).afterDismissed().subscribe((res) => {
                          this.dataservice.notifyTaskCompletion();
                          this.router.navigateByUrl('dashboard/ideas');
                        });;
                    }
                  }, error: (httpError: HttpErrorResponse) => {
                    let responseError: ResponseDto = httpError.error;
                    this.snackbar
                      .open(responseError.message, 'X', {
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

  ngOnDestroy(): void {
    this.dataservice.clearObject();
  }
}
