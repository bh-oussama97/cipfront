import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { IFile } from 'src/app/shared/interfaces/file';

@Component({
  selector: 'app-add-line',
  templateUrl: './add-line.component.html',
  styleUrls: ['./add-line.component.scss']
})
export class AddLineComponent implements OnInit{

  faInformation = faInfoCircle;
  selectedValue: string;
    sites : any[] = ['Sousse','Mateur Sud','Mateur Nord','Manzel Hayet'];
    plants : any[] = ['BMW','VW','AUDI','MS1','MN1','MH1'];
    segments : any[] = ['Cutting & WPA MEB AUTARK','Segment 45','Segment 59','Segment 53-1','Cutting & WPA SYSAPP LTN1','Segment Muster SYSAPP'];
  addLineForm:FormGroup;
  constructor(private snackbar:MatSnackBar,
    private translate:TranslateService,
    private fb:FormBuilder,
    private router : Router
    ){}

  ngOnInit(): void {
    this.addLineForm = this.fb.group({
      'plantName' : [''],
      'siteName' : [''],
      'segmentName' : [''],
      'nameLine' : ['']
    })
  }
  addNewLine(){
    this.snackbar
    .open(this.translate.instant('linesContent.addLineForm.successAdd'), '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'notification-success'
    })
    .afterDismissed().subscribe((res)=>{
      this.router.navigateByUrl('lines');
    });
  }
      /**
   * This gets the list of uploaded files from file uploader component
   * @param fileList
   */
      getUploadedFiles(fileList: IFile[]) {
        if (fileList.length > 0)
        {
          this.snackbar
          .open(this.translate.instant('linesContent.addLineForm.successAdd'), '', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'notification-success'
          })
          .afterDismissed().subscribe((res)=>{
            this.router.navigateByUrl('lines');
          });
        }
      }
}
