import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { faFileImage } from '@fortawesome/free-regular-svg-icons';
import { faUpload } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import {
  Subscription,
  catchError,
  concatMap,
  debounceTime,
  forkJoin,
  of,
  tap,
} from 'rxjs';
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
import { UserDto } from 'src/app/shared/interfaces/user-dto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';
import { IdeaService } from 'src/app/shared/services/idea.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { saveAs } from 'file-saver';
import { FileService } from 'src/app/shared/services/file.service';
import { IdeaDto } from 'src/app/shared/interfaces/idea-dto';
import { OpenKaizenImageComponent } from 'src/app/shared/components/open-kaizen-image/open-kaizen-image.component';
import { DateTime } from 'luxon';
import * as exceljs from 'exceljs';

@Component({
  selector: 'app-select-idea',
  templateUrl: './select-idea.component.html',
  styleUrls: ['./select-idea.component.scss'],
})
export class SelectIdeaComponent implements OnInit {
  ideaDetails: IdeaDto;
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
  isOriginaliteValueValid = false;
  isImpactValueValid = false;
  isInputValid = true;
  isLoading: boolean = false;
  category: string;
  ideaId: string;
  ideaCreatedDate: any;
  validChoice: any;
  globalChoice: any;
  kaizenImageBeforeName: string;
  kaizenImageAfterName: string;
  ideaDescription: string;
  kaizenFilename: string;
  constructor(
    private dataservice: DataService,
    private fb: FormBuilder,
    private dialogService: ModalService,
    private translate: TranslateService,
    private ideaService: IdeaService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private fileService: FileService,
    private activatedRoute: ActivatedRoute
  ) {
    this.motifs = [
      Motif.NONE,
      Motif.INCLEAR_IDEA,
      Motif.NOT_STANDARD,
      Motif.RECURRENT_IDEA,
    ];
    this.ideaSelectionForm = this.fb.group({
      validationChoice: new FormControl('yes', [Validators.required]),
      motif: new FormControl('', [Validators.required]),
      generalizableChoice: new FormControl('yes', [Validators.required]),
      originaliteNote: new FormControl(
        0,
        Validators.compose([Validators.required, SelectIdeaComponent.nonZero])
      ),
      impactNote: new FormControl(
        0,
        Validators.compose([Validators.required, SelectIdeaComponent.nonZero])
      ),
    });
  }

  ngOnInit(): void {
    this.connectedUser = this.authService.get_login_info();
    this.activatedRoute.paramMap.subscribe({
      next: (params: ParamMap) => {
        this.ideaId = params.get('ideaId');
        if (this.ideaId) {
          this.fetchIdeaDetails(this.ideaId);
        }
      },
      error: (error) => {
        console.error('Error fetching idea details:', error);
      },
      complete: () => {},
    });
    this.ideaSelectionForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(async (valuechange) => {
        if (this.ideaDetails.expert === null) {
          this.ideaSelectionForm.controls['originaliteNote'].disable();
          this.ideaSelectionForm.controls['impactNote'].disable();
        } else {
          this.ideaSelectionForm.controls['originaliteNote'].enable();
          this.ideaSelectionForm.controls['impactNote'].enable();
        }
        if (
          valuechange.generalizableChoice === 'no' &&
          valuechange.validationChoice === 'no'
        ) {
          this.ideaSelectionForm.controls['motif'].enable();
        }

        if (
          valuechange.generalizableChoice === 'yes' &&
          valuechange.validationChoice === 'yes'
        ) {
          this.ideaSelectionForm.controls['motif'].disable();
        }

        if (
          valuechange.impactNote >= 0 &&
          valuechange.impactNote <= 10 &&
          valuechange.originaliteNote >= 0 &&
          valuechange.originaliteNote <= 10
        ) {
          this.noteTotal =
            (valuechange.impactNote + valuechange.originaliteNote) / 2;
        } else {
          this.noteTotal = 0;
        }
      });
    if (this.ideaSelectionForm.get('validationChoice').value === 'yes') {
      this.ideaSelectionForm.controls['motif'].disable();
    }

    this.ideaSelectionForm.valueChanges
      .pipe(debounceTime(500))
      .subscribe(async (valuechange) => {
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

    if (
      Object.keys(ideaSelectionFormValue).indexOf('motif') > -1 &&
      this.ideaSelectionForm.value.motif !== 'NONE'
    ) {
      this.dialogService.create({
        component: DefaultModalComponent,
        message: this.translate.instant(
          'ideasContent.ideaSelectionContent.rejectIdea'
        ),
        isDeleteConfirmationModal: false,
        width: '30%',
        height: 'fit-content',
        customModalClass: 'alert-modal',
        buttons: [
          {
            type: 'stroked',
            text: this.translate.instant(
              'ideasContent.ideaValidationContent.yes'
            ),
            handler: () => {
              const rejectedIdea: NextStepDto = {
                ideaId: this.ideaDetails.ideaId,
                description: this.ideaDetails.description,
                status: IdeaState.REFUSED,
                matricule: this.connectedUser.matricule,
                affectedTo: this.ideaDetails.matricule,
                impact: this.ideaSelectionForm.value.impactNote,
                original: this.ideaSelectionForm.value.originaliteNote,
                global:
                  this.ideaSelectionForm.value.generalizableChoice === 'yes'
                    ? true
                    : false,
                valid:
                  this.ideaSelectionForm.value.validationChoice === 'yes'
                    ? true
                    : false,
                type: this.ideaDetails.type,
                motif: this.ideaSelectionForm.value.motif,
                decision: Decision.REJECTED,
                category: Category.NONE,
                total: this.noteTotal,
              };
              this.ideaService.updateIdeaNextStep(rejectedIdea).subscribe({
                next: (response: any) => {
                  if (response !== null) {
                    this.snackbar
                      .open('Idea has been rejected !', '', {
                        duration: 2000,
                        horizontalPosition: 'right',
                        verticalPosition: 'top',
                        panelClass: 'notification-error',
                      })
                      .afterDismissed()
                      .subscribe((res) => {
                        this.dataservice.notifyTaskCompletion();
                        this.router.navigateByUrl('/ideas');
                      });
                  }
                },
                error: (httpError: HttpErrorResponse) => {
                  let responseError: ResponseDto = httpError.error;
                  this.snackbar
                    .open(responseError.message, '', {
                      duration: 2000,
                      horizontalPosition: 'right',
                      verticalPosition: 'top',
                      panelClass: 'notification-error',
                    })
                    .afterDismissed()
                    .subscribe((res) => {
                      this.router.navigateByUrl('/ideas');
                    });
                },
              });
              return true;
            },
          },
          {
            type: 'flat',
            text: this.translate.instant(
              'ideasContent.ideaValidationContent.no'
            ),
            handler: () => {
              return true;
            },
          },
        ],
      });
    } else if (this.ideaSelectionForm.value.motif === 'NONE') {
      this.dialogService.create({
        component: DefaultModalComponent,
        message: this.translate.instant(
          'ideasContent.ideaSelectionContent.selectPattern'
        ),
        isDeleteConfirmationModal: false,
        width: '30%',
        height: 'fit-content',
        customModalClass: 'alert-modal',
        buttons: [
          {
            type: 'flat',
            text: this.translate.instant(
              'ideasContent.ideaSelectionContent.ok'
            ),
            handler: () => {
              return true;
            },
          },
        ],
      });
    } else {
      this.dialogService.create({
        component: DefaultModalComponent,
        message: this.translate.instant(
          'ideasContent.ideaSelectionContent.assignIdeaToExpertAlert'
        ),
        isDeleteConfirmationModal: false,
        width: '35%',
        height: 'fit-content',
        customModalClass: 'assign-idea-expert-modal',
        buttons: [
          {
            type: 'stroked',
            text: this.translate.instant(
              'ideasContent.ideaValidationContent.yes'
            ),
            handler: () => {
              this.dialog.open(SelectExpertModalComponent, {
                data: {
                  expertList: this.expertsList,
                  ideaDetails: this.ideaDetails,
                  valid: this.ideaSelectionForm.value.validationChoice,
                  generalizable:
                    this.ideaSelectionForm.value.generalizableChoice,
                  originalite: this.ideaSelectionForm.value.originaliteNote,
                  impact: this.ideaSelectionForm.value.impactNote,
                  motif: this.ideaSelectionForm.value.motif,
                  noteTotal: this.noteTotal,
                  category: this.ideaDetails.category,
                },
                minWidth: '40%',
                minHeight: 'fit-content',
                panelClass: 'alert-modal',
              });
              return true;
            },
          },
          {
            type: 'flat',
            text: this.translate.instant(
              'ideasContent.ideaValidationContent.no'
            ),
            handler: () => {
              return true;
            },
          },
        ],
      });
    }
  }
  closeIdea() {
    //  if(this.ideaDetails?.kaizen === null)
    // {
    //   this.snackbar
    //   .open(this.translate.instant('ideasContent.ideaSelectionContent.uploadKaizenCard'), '', {
    //     duration: 2000,
    //     horizontalPosition: 'right',
    //     verticalPosition: 'top',
    //     panelClass: 'notification-error'
    //   });
    // }
    if (this.originaliteNote === undefined && this.impactNote === undefined) {
      this.snackbar.open(
        this.translate.instant(
          'ideasContent.ideaSelectionContent.chooseOriginaliteImpactNote'
        ),
        'X',
        {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: 'notification-error',
        }
      );
    } else {
      this.isLoading = true;

      forkJoin({
        api1: this.fileService.downloadFileByName(this.kaizenImageBeforeName),
        api2: this.fileService.downloadFileByName(this.kaizenImageAfterName),
      })
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
          tap(async (response) => {
            await this.createExcelWithImages(response.api1, response.api2);
          }),
          concatMap(() =>
            this.ideaService.updateIdeaNextStep({
              ideaId: this.ideaDetails.ideaId,
              description: this.ideaDetails.description,
              status: IdeaState.VALIDATED,
              matricule: this.ideaDetails.matricule,
              affectedTo: this.connectedUser.matricule,
              impact: this.impactNote,
              original: this.originaliteNote,
              global: this.ideaDetails.global,
              valid: this.ideaDetails.valid,
              type: this.ideaDetails.type,
              motif: this.ideaDetails.motif,
              decision: Decision.VALIDATED,
              category: this.ideaDetails.category,
              total: this.noteTotal,
            })
          )
        )
        .subscribe({
          next: (response: any) => {
            if (response !== null) {
              setTimeout(() => {
                this.isLoading = false;
                this.snackbar
                  .open('Idea has been closed !', '', {
                    duration: 2000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                    panelClass: 'notification-success',
                  })
                  .afterDismissed()
                  .subscribe((res) => {
                    this.dataservice.notifyTaskCompletion();
                    this.router.navigateByUrl('/ideas');
                  });
              }, 3000);
            }
          },
          error: (httpError: HttpErrorResponse) => {
            let responseError: ResponseDto = httpError.error;
            this.snackbar
              .open(responseError.message, '', {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: 'notification-error',
              })
              .afterDismissed()
              .subscribe((res) => {
                this.router.navigateByUrl('/ideas');
              });
          },
        });
    }
  }
  openKaizenCardModal() {
    this.dialog
      .open(ImportKaizenCardModalComponent, {
        data: {
          ideaId: this.ideaDetails.ideaId,
        },
        minWidth: '30%',
        minHeight: 'fit-content',
      })
      .afterClosed()
      .subscribe((result: string) => {
        this.getIdeaById(this.ideaDetails.ideaId);
      });
  }

  static nonZero(control: FormControl): { [key: string]: any } {
    if (Number(control.value) < 0) {
      return { nonZero: true };
    } else {
      return null;
    }
  }

  getKaizenImageByName(name: string) {
    this.fileService
      .downloadFileByName(name)
      .subscribe((data) => saveAs(data, name));
  }

  openKaizenImage(name: string) {
    this.dialog.open(OpenKaizenImageComponent, {
      data: {
        kaizenImage: name,
      },
      minWidth: '40%',
      minHeight: 'fit-content',
      panelClass: 'custom-modalbox',
    });
  }

  getIdeaById(id: string) {
    this.ideaService.getIdeaById(id).subscribe((ideaDto: IdeaDto) => {
      this.ideaDetails = ideaDto;
    });
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

  fetchIdeaDetails(ideaId: string) {
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
        tap((ideaDto: IdeaDto) => {
          this.ideaDetails = ideaDto;
          this.ideaDescription = ideaDto.description;
          this.kaizenImageBeforeName = ideaDto.kaizanBefore;
          this.kaizenImageAfterName = ideaDto.kaizanAfter;
          this.ideaCreatedDate = DateTime.fromISO(this.ideaDetails.createdAt, {
            zone: 'utc',
          })
            .setZone('Africa/Tunis')
            .toFormat('dd/MM/yyyy hh:mm a');

          if (ideaDto.status === IdeaState.PRESELECTED) {
            this.globalChoice = 'yes';
            this.validChoice = 'yes';
          } else {
            this.globalChoice = ideaDto.global === false ? 'no' : 'yes';
            this.validChoice = ideaDto.valid === false ? 'no' : 'yes';
          }

          this.category = ideaDto.category;

          if (this.ideaDetails?.decision === Decision.EXECUTED) {
            this.ideaSelectionForm.controls['generalizableChoice'].disable();
            this.ideaSelectionForm.controls['validationChoice'].disable();
          }
        }),
        concatMap(() =>
          this.ideaService.getResponsiblesListByEmployeeMatriculeAndRole(
            this.ideaDetails.matricule,
            Profile.EXPERT
          )
        )
      )
      .subscribe((responsibles: UserDto[]) => {
        this.expertsList = responsibles;
      });
  }

  async blobToBuffer(blob: Blob): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        resolve(new Uint8Array(arrayBuffer));
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });
  }

  async createExcelWithImages(kaizenBefore: Blob, kaizenAfter: Blob) {
    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Images');
    const imageBuffer1 = await this.blobToBuffer(kaizenBefore);
    const imageBuffer2 = await this.blobToBuffer(kaizenAfter);
    this.kaizenFilename =
      'kaizen-card-' + DateTime.now().toFormat('dd-MM-yyyy-hh-mm') + '.xlsx';
    const imageId1 = workbook.addImage({
      buffer: imageBuffer1,
      extension: 'png',
    });
    const imageId2 = workbook.addImage({
      buffer: imageBuffer2,
      extension: 'png',
    });
    worksheet.addImage(imageId1, {
      tl: { col: 0, row: 0 },
      ext: { width: 200, height: 300 },
    });
    worksheet.addImage(imageId2, {
      tl: { col: 5, row: 0 },
      ext: { width: 200, height: 300 },
    });
    const buffer = await workbook.xlsx.writeBuffer();

    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    let formData = new FormData();
    formData.append('id', this.ideaDetails.ideaId);
    formData.append(
      'file',
      new File([blob], this.kaizenFilename, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
    );
    formData.append('status', 'kaizen');
    debugger;
    this.fileService.uploadKaizenCard(formData).subscribe({
      next: (result: any) => {},
      error: (httpError: HttpErrorResponse) => {
        setTimeout(() => {
          this.isLoading = false;
          this.snackbar.open(httpError.error, '', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'notification-error',
          });
        }, 2000);
      },
    });
  }
}
