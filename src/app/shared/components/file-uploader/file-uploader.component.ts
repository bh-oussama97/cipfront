import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IFile } from 'src/app/shared/interfaces/file';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faFolderOpen, faInfoCircle } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit {
  faInformation = faInfoCircle;
  faFolder = faFolderOpen;
  selectedFiles: IFile[] = [];
  mode: ProgressBarMode = 'determinate';
  file: File = null; // Variable to store file
  keyTranslated = '';
  @Output() sendUploadedFiles = new EventEmitter<any>();
  @Output() cancelUploadEm = new EventEmitter<any>();
  @Output() isLoadingChange = new EventEmitter<boolean>();
  isLoading: boolean;
  constructor(
    private translate: TranslateService,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.keyTranslated = this.translate.instant(
      'fileUploadContent.importerFichierExcel'
    );
  }

  onChange(event) {
    this.prepareFilesList(event.target.files);
  }

  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  prepareFilesList(files: any[]) {
    let validExtensions: string[] = ['xlsx'];
    for (let item of files) {
      let fileExt = item.name.split('.')[1];
      if (validExtensions.indexOf(fileExt) < 0) {
        this.snackbar
          .open(this.translate.instant('fileUploadContent.invalidType'), '', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'notification-error',
          })
          .afterOpened()
          .subscribe((res) => {});
      } else {
        item.progress = 0;
        this.selectedFiles.push({
          name: item.name, value: item, type: item.name.split('.')[1].toUpperCase(),
          progress: item.progress
        });
        // this.saveUploadedFiles(this.selectedFiles);
      }
    }
    this.uploadFilesSimulator(0);
  }

  uploadFilesSimulator(index: number) {
    setTimeout(() => {
      if (index === this.selectedFiles.length) {
        return;
      } else {
        const progressInterval = setInterval(() => {
          if (this.selectedFiles[index].progress === 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            this.selectedFiles[index].progress += 5;
          }
        }, 200);
      }
    }, 1000);
  }

  saveUploadedFiles(item)
  {    
    this.sendUploadedFiles.emit(item);
  }

  cancelUpload() {
    this.selectedFiles = [];
    this.cancelUploadEm.emit();
  }
}
