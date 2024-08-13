import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { faFileImage } from '@fortawesome/free-regular-svg-icons';
import { faFileExport, faUpload } from '@fortawesome/free-solid-svg-icons';
import { IdeaDto } from 'src/app/shared/interfaces/idea-dto';
import { DataService } from 'src/app/shared/services/data.service';
import { FileService } from 'src/app/shared/services/file.service';
import { IdeaService } from 'src/app/shared/services/idea.service';
import { saveAs } from 'file-saver';
import { OpenKaizenImageComponent } from 'src/app/shared/components/open-kaizen-image/open-kaizen-image.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-idea-details',
  templateUrl: './idea-details.component.html',
  styleUrls: ['./idea-details.component.scss'],
})
export class IdeaDetailsComponent implements OnInit {
  currentRole: string;
  faUpload = faUpload;
  faDownload = faFileImage;
  faExport = faFileExport;
  ideaId: string;
  originaliteNote: number;
  impactNote: number;
  noteTotal: number;
  imageBefore: string;
  imageAfter: string;
  ideaCategory: string;
  ideaMotif: string;
  ideaDTO: IdeaDto;
  validation: string;
  generalization: string;
  ideaCreatedDate:any;
  constructor(
    private dataservice: DataService,
    private ideaService: IdeaService,
    private activatedRoute: ActivatedRoute,
    private fileService: FileService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.currentRole = JSON.parse(localStorage.getItem('userJson'))['roles'];

    this.activatedRoute.paramMap.subscribe({
      next: (params: ParamMap) => {
        this.ideaId = params.get('ideaId');
        if(this.ideaId)
        {
          this.getIdeaById(this.ideaId);
        }
      },
    });
  }

  getKaizenImageByName(name: string) {
    this.fileService
      .downloadFileByName(name)
      .subscribe((data) => saveAs(data, name));
  }

  getIdeaById(ideaId: string) {
    this.ideaService.getIdeaById(ideaId).subscribe((response: IdeaDto) => {
      this.ideaDTO = response;
      this.generalization = response.global === false ? 'no' : 'yes';
      this.validation = response.valid === false ? 'no' : 'yes';
      this.originaliteNote = response.original;
      this.impactNote = response.impact;
      this.noteTotal = response.total;
      this.imageBefore = response.kaizanBefore;
      this.imageAfter = response.kaizanAfter;
      this.ideaCategory = response.category;
      this.ideaMotif = response.motif;
      this.ideaCreatedDate = DateTime.fromISO(response.createdAt,{zone:'utc'}).setZone('Africa/Tunis').toFormat("dd/MM/yyyy hh:mm a");

    });
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

  getKaizenCardByName(name: string) {
    this.fileService.downloadFileByName(name).subscribe({
      next: (response: any) => {
        this.fileService.saveAsExcelFile(response, name.split('.')[0]);
      },
      error: (responseError: HttpErrorResponse) => {
        if (responseError.status === 500) {
          this.snackbar.open('Could not read the file!', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'notification-error',
          });
        }
      },
    });
  }
}
