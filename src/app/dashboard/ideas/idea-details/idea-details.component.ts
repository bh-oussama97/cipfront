import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { faFileImage } from '@fortawesome/free-regular-svg-icons';
import { faFileExport, faUpload } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { Profile } from 'src/app/shared/enum/profile';
import { IdeaDto } from 'src/app/shared/interfaces/idea-dto';
import { DataService } from 'src/app/shared/services/data.service';
import { FileService } from 'src/app/shared/services/file.service';
import { IdeaService } from 'src/app/shared/services/idea.service';
import { saveAs } from "file-saver";
import { OpenKaizenImageComponent } from 'src/app/shared/components/open-kaizen-image/open-kaizen-image.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResponseDto } from 'src/app/shared/interfaces/response-dto';
@Component({
  selector: 'app-idea-details',
  templateUrl: './idea-details.component.html',
  styleUrls: ['./idea-details.component.scss']
})
export class IdeaDetailsComponent implements OnInit {

  ideaDetails: any;
  subscription: Subscription;
  currentRole: string;
  faUpload = faUpload;
  faDownload = faFileImage;
  faExport = faFileExport;
  filename: string;
  ideaState: string;
  ideaId: string;
  ideaMasterFullName: string;
  expertFullName: string;
  ideaSegmentMangerFullName: string;
  originaliteNote: number;
  impactNote: number;
  noteTotal: number;
  imageBefore: string;
  imageAfter: string;
  ideaCategory: string;
  ideaMotif: string;
  ideaDTO: IdeaDto;
  validation: number;
  generalization: number;
  constructor(private dataservice: DataService, private ideaService: IdeaService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    this.currentRole = JSON.parse(localStorage.getItem('userJson'))['roles'];

    this.activatedRoute.paramMap.subscribe({
      next: (params: ParamMap) => {
        this.ideaId = params.get('ideaId');
      },
    });
    // this.subscription = this.dataservice.currentMessage$.subscribe({
    //   next: (message: any) => {
    //     this.ideaDetails = message;
    //     if(this.ideaDetails.responsables)
    //     {
    //       for (let responsable of this.ideaDetails?.responsables) {
    //         if (responsable.roles[0] === Profile.CHEF_SEGMENT) {
    //           this.ideaSegmentMangerFullName = responsable.fullName;
    //         }
    //         if (responsable.roles[0] === Profile.CONTRE_MAITRE) {
    //           this.ideaMasterFullName = responsable.fullName;
    //         }
    //         if (responsable.roles[0] === Profile.EXPERT) {
    //           this.expertFullName = responsable.fullName;
    //         }
    //       }
    //     }
    //     if (message === null) {
    //       this.ideaDetails = this.dataservice.getObjectFromSessionStorage();
    //     }
    //   }
    // });
    this.getIdeaById(this.ideaId );
  }

  getKaizenImageByName(name: string) {
    this.fileService.downloadFileByName(name).subscribe(data => saveAs(data, name));
  }

  getIdeaById(ideaId: string) {
    this.ideaService.getIdeaById(ideaId).subscribe((response: IdeaDto) => {
      this.ideaDTO = response;
      this.validation = this.ideaDTO.valid === true ? 1 : 0;
      this.generalization = this.ideaDTO.global === true ? 1 : 0;
      this.originaliteNote = response.original;
      this.impactNote = response.impact;
      this.noteTotal = response.total;
      this.imageBefore = response.kaizanBefore;
      this.imageAfter = response.kaizanAfter;
      this.ideaCategory = response.category;
      this.ideaMotif = response.motif;
    });
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

  getKaizenCardByName(name: string) {
    this.fileService.downloadFileByName(name).subscribe(
      {
        next: (response: any) => {
          this.fileService.saveAsExcelFile(response, name.split('.')[0]);
        }, error: (responseError: HttpErrorResponse) => {
          if (responseError.status === 500) {
            this.snackbar
              .open("Could not read the file!", '', {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: 'notification-error'
              });
          }

        }
      });
  }

  // public ngOnDestroy(): void {
  //   this.dataservice.clearObject();
  // }

}
