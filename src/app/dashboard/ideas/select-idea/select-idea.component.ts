import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faFileImage } from '@fortawesome/free-regular-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, debounceTime } from 'rxjs';
import { DefaultModalComponent } from 'src/app/shared/components/default-modal/default-modal.component';
import { ImportKaizenCardModalComponent } from 'src/app/shared/components/import-kaizen-card-modal/import-kaizen-card-modal.component';
import { SelectExpertModalComponent } from 'src/app/shared/components/select-expert-modal/select-expert-modal.component';
import { Category } from 'src/app/shared/enum/category';
import { Decision } from 'src/app/shared/enum/decision';
import { IdeaState } from 'src/app/shared/enum/idea-state';
import { Motif } from 'src/app/shared/enum/motif';
import { Profile } from 'src/app/shared/enum/profile';
import { NextStepDto } from 'src/app/shared/interfaces/next-step-dto';
import { ResponseDto } from 'src/app/shared/interfaces/response-dto';
import { TaskDto } from 'src/app/shared/interfaces/task-dto';
import { UserDto } from 'src/app/shared/interfaces/user-dto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { IdeaService } from 'src/app/shared/services/idea.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { saveAs } from 'file-saver';
import { FileService } from 'src/app/shared/services/file.service';
import { IdeaDto } from 'src/app/shared/interfaces/idea-dto';
import { OpenKaizenImageComponent } from 'src/app/shared/components/open-kaizen-image/open-kaizen-image.component';
@Component({
  selector: 'app-select-idea',
  templateUrl: './select-idea.component.html',
  styleUrls: ['./select-idea.component.scss']
})
export class SelectIdeaComponent implements OnInit {

  ideaDetails: TaskDto;
  subscription: Subscription;
  description: string;
  ideaSelectionForm: FormGroup;
  expertsList: UserDto[];
  motifs: string[];
  currentRole: string;
  faUpload = faUpload;
  faDownload = faFileImage;
  filename: string;
  noteTotal: number;
  originaliteNote: number;
  impactNote: number;
  motifByDefault: string = Motif.NONE;
  connectedUser: any;
  ideaMasterFullName: string;
  expertFullName: string;
  isOriginaliteValueValid = false;
  isImpactValueValid = false;
  isInputValid = true;
  ideaDTO: IdeaDto;
  isLoading: boolean = false;
  category:string;
  constructor(private dataservice: DataService,
    private fb: FormBuilder,
    private dialogService: ModalService,
    private translate: TranslateService,
    private ideaService: IdeaService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private fileService: FileService
  ) {
    this.motifs = [Motif.NONE, Motif.INCLEAR_IDEA, Motif.NOT_STANDARD, Motif.RECURRENT_IDEA];
    this.ideaSelectionForm = this.fb.group({
      validationChoice: new FormControl('yes', [Validators.required]),
      motif: new FormControl('', [Validators.required]),
      generalizableChoice: new FormControl('yes', [Validators.required]),
      originaliteNote: new FormControl(0, Validators.compose([
        Validators.required, SelectIdeaComponent.nonZero])),
      impactNote: new FormControl(0, Validators.compose([
        Validators.required, SelectIdeaComponent.nonZero]))
    });
  }


  ngOnInit(): void {
    this.authService.getLoggedInUser().subscribe((loggedInUser: any) => {
      this.connectedUser = loggedInUser;
    })
    this.subscription = this.dataservice.currentMessage$.subscribe({
      next: (message: any) => {
        this.ideaDetails = message;
        this.getIdeaById(this.ideaDetails.ideaId);
        this.description = message.description;
        if(this.ideaDetails.responsables.length > 0)
        {
          for (let responsable of this.ideaDetails.responsables) {
            if (responsable.roles[0] === Profile.CONTRE_MAITRE) {
              this.ideaMasterFullName = responsable.fullName;
            }
            if (responsable.roles[0] === Profile.EXPERT) {
              this.expertFullName = responsable.fullName;
            }
          }
        }
      }
    });
    this.ideaService.getResponsiblesListByEmployeeMatriculeAndRole(this.ideaDetails.employee, Profile.EXPERT).subscribe((result: UserDto[]) => {
      this.expertsList = result;
    });
    this.ideaSelectionForm.valueChanges.pipe(debounceTime(500)).subscribe(async valuechange => {

      if (valuechange.generalizableChoice === 'no' && valuechange.validationChoice === 'no') {
        this.ideaSelectionForm.controls['motif'].enable();
      }

      if (valuechange.generalizableChoice === 'yes' && valuechange.validationChoice === 'yes') {
        this.ideaSelectionForm.controls['motif'].disable();
      }

      if ((valuechange.impactNote >= 0 && valuechange.impactNote <= 10) && (valuechange.originaliteNote >= 0 && valuechange.originaliteNote <= 10)) {
        this.noteTotal = (valuechange.impactNote + valuechange.originaliteNote) / 2;
      }
      else {
        this.noteTotal = 0;
      }
    });
    if (this.ideaSelectionForm.get('validationChoice').value === 'yes') {
      this.ideaSelectionForm.controls['motif'].disable();
    }

    this.ideaSelectionForm.valueChanges.pipe(debounceTime(500)).subscribe(async valuechange => {

      if (valuechange.originaliteNote < 0) {

      }
      if (valuechange.validationChoice === 'no') {
        this.ideaSelectionForm.controls['motif'].enable();
      }
      if (valuechange.validationChoice === 'yes') {
        this.ideaSelectionForm.controls['motif'].disable();
      }
    });
  }


  uploadCardKaizen(event) {
    this.filename = event.target.files[0].name;
  }
  sendChanges() {


    // if (this.ideaSelectionForm.valid) {
      let ideaSelectionFormValue: any = this.ideaSelectionForm.value;

      if (Object.keys(ideaSelectionFormValue).indexOf('motif') > -1 && this.ideaSelectionForm.value.motif !== 'NONE') {
        this.dialogService.create(
          {
            component: DefaultModalComponent,
            message: this.translate.instant('ideasContent.ideaSelectionContent.rejectIdea'),
            isDeleteConfirmationModal: false,
            width: '30%',
            height: 'fit-content',
            customModalClass: 'alert-modal',
            buttons: [
              {
                type: 'stroked',
                text: this.translate.instant('ideasContent.ideaValidationContent.yes'),
                handler: () => {
                  const rejectedIdea: NextStepDto = {
                    ideaId: this.ideaDetails.ideaId,
                    description: this.ideaDetails.description,
                    status: IdeaState.CLOSED,
                    matricule: this.connectedUser.matricule,
                    affectedTo: this.ideaDetails.employee,
                    impact: this.ideaSelectionForm.value.impactNote,
                    original: this.ideaSelectionForm.value.originaliteNote,
                    global: this.ideaSelectionForm.value.generalizableChoice === 'yes' ? true : false,
                    valid: this.ideaSelectionForm.value.validationChoice === 'yes' ? true : false,
                    type: this.ideaDetails.type,
                    motif: this.ideaSelectionForm.value.motif,
                    decision: Decision.REJECTED,
                    category: Category.NONE,
                    total: this.noteTotal
                  };
                  this.ideaService.updateIdeaNextStep(rejectedIdea).subscribe(
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
                    }
                  );
                  return true;
                }
              },
              {
                type: 'flat',
                text: this.translate.instant('ideasContent.ideaValidationContent.no'),
                handler: () => {
                  return true;
                }
              }
            ]
          }
        );
      }
      else if (this.ideaSelectionForm.value.motif === 'NONE') {
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
      // else if(this.ideaDTO?.kaizen === null)
      // {
      //   this.snackbar
      //   .open(this.translate.instant('ideasContent.ideaSelectionContent.uploadKaizenCard'), 'X', {
      //     duration: 2000,
      //     horizontalPosition: 'right',
      //     verticalPosition: 'top',
      //     panelClass: 'notification-warning'
      //   });
      // }
      else {
        this.dialogService.create(
          {
            component: DefaultModalComponent,
            message: this.translate.instant('ideasContent.ideaSelectionContent.assignIdeaToExpertAlert'),
            isDeleteConfirmationModal: false,
            width: '35%',
            height: 'fit-content',
            customModalClass: 'assign-idea-expert-modal',
            buttons: [
              {
                type: 'stroked',
                text: this.translate.instant('ideasContent.ideaValidationContent.yes'),
                handler: () => {
                  this.dialog.open(SelectExpertModalComponent,
                    {
                      data: {
                        expertList: this.expertsList, ideaDetails: this.ideaDetails,
                        valid: this.ideaSelectionForm.value.validationChoice,
                        generalizable: this.ideaSelectionForm.value.generalizableChoice,
                        originalite: this.ideaSelectionForm.value.originaliteNote,
                        impact: this.ideaSelectionForm.value.impactNote,
                        motif: this.ideaSelectionForm.value.motif,
                        noteTotal: this.noteTotal
                      },
                      minWidth: '40%',
                      minHeight: 'fit-content',
                      panelClass: 'alert-modal'
                    });
                  return true;
                }
              },
              {
                type: 'flat',
                text: this.translate.instant('ideasContent.ideaValidationContent.no'),
                handler: () => {
                  return true;
                }
              }
            ]
          }
        );
      }


    // }
    // else {
    //   this.snackbar
    //   .open(this.translate.instant('ideasContent.ideaSelectionContent.checkAllFields'), 'X', {
    //     duration: 2000,
    //     horizontalPosition: 'right',
    //     verticalPosition: 'top',
    //     panelClass: 'notification-error'
    //   });
    // }
  }
  closeIdea() {
    this.isLoading = true;
    const ideaClosed: NextStepDto = {
      ideaId: this.ideaDetails.ideaId,
      description: this.ideaDTO.description,
      status: IdeaState.CLOSED,
      matricule: this.ideaDTO.matricule,
      affectedTo: this.connectedUser.matricule,
      impact: this.impactNote,
      original: this.originaliteNote,
      global: this.ideaDTO.global,
      valid: this.ideaDTO.valid,
      type: this.ideaDTO.type,
      motif: this.ideaDTO.motif,
      decision: Decision.CLOSED,
      category: this.ideaDTO.category,
      total: this.noteTotal
    };
    this.ideaService.updateIdeaNextStep(ideaClosed).subscribe(
      {
        next: (response: any) => {
          if (response !== null) {
            setTimeout(() => {
              this.isLoading = false;
              this.snackbar
                .open("Idea has been closed !", 'X', {
                  duration: 2000,
                  horizontalPosition: 'right',
                  verticalPosition: 'top',
                  panelClass: 'notif-success'
                }).afterDismissed().subscribe((res) => {
                  this.dataservice.notifyTaskCompletion();
                  this.router.navigateByUrl('dashboard/ideas');
                });
            }, 3000);
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
      }
    )
  }
  openKaizenCardModal() {
    this.dialog.open(ImportKaizenCardModalComponent,
      {
        data: {
          ideaId: this.ideaDetails.ideaId
        },
        minWidth: '30%',
        minHeight: 'fit-content',
      })
      .afterClosed().subscribe((result: string) => {
        this.getIdeaById(this.ideaDetails.ideaId);
      })
  }

  static nonZero(control: FormControl): { [key: string]: any; } {
    if (Number(control.value) < 0) {
      return { nonZero: true };
    } else {
      return null;
    }
  }

  getKaizenImageByName(name: string) {
    this.fileService.downloadFileByName(name).subscribe(data => saveAs(data, name));
  }

  openKaizenImage(name: string) {

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

  getIdeaById(id: string) {
    this.ideaService.getIdeaById(id).subscribe((ideaDto: IdeaDto) => {      
      this.ideaDTO = ideaDto;
      this.category = ideaDto.category;
      if (this.ideaDTO?.decision === Decision.VALIDATED) {
        this.ideaSelectionForm.controls['originaliteNote'].disable();
        this.ideaSelectionForm.controls['impactNote'].disable();
      }
      if (this.ideaDTO?.decision === Decision.ACCEPTED) {
        this.ideaSelectionForm.controls['generalizableChoice'].disable();
        this.ideaSelectionForm.controls['validationChoice'].disable();
      }
    })
  }
  checkOriginaliteValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const numberValue = Number(value);
    this.isOriginaliteValueValid = this.isGreaterThan(numberValue);
  }
  checkImpactValue(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    const numberValue = Number(value);
    this.isImpactValueValid = this.isGreaterThan(numberValue);
  }
  isGreaterThan(value: number) {
    this.isInputValid = !isNaN(value);
    return this.isInputValid && value > 10;
  }
}
