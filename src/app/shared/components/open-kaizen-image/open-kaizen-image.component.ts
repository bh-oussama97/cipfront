import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileService } from '../../services/file.service';
import { faClose, faDownload } from '@fortawesome/free-solid-svg-icons';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-open-kaizen-image',
  templateUrl: './open-kaizen-image.component.html',
  styleUrls: ['./open-kaizen-image.component.scss']
})
export class OpenKaizenImageComponent implements OnInit {
  imageBlobUrl: string | ArrayBuffer = null;
  close = faClose;
  fadownload = faDownload;
  constructor(@Inject(MAT_DIALOG_DATA) public data:
    {
      kaizenImage: string
    },
    public dialogRef: MatDialogRef<OpenKaizenImageComponent>,
    private fileService: FileService
  ) {
  }
  ngOnInit(): void {
    this.fileService.downloadFileByName(this.data.kaizenImage).subscribe((data: Blob) => {
      this.createImageFromBlob(data);
    });

  }

  downloadImage() {
    this.fileService.downloadFileByName(this.data.kaizenImage).subscribe(data => saveAs(data, this.data.kaizenImage));
  }
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageBlobUrl = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }


}


