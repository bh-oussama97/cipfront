import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { IFile } from 'src/app/shared/interfaces/file';

@Component({
  selector: 'app-add-segment',
  templateUrl: './add-segment.component.html',
  styleUrls: ['./add-segment.component.scss']
})
export class AddSegmentComponent implements OnInit{

  faInformation = faInfoCircle;
  addSegmentForm:FormGroup;
  selectedValue: string;
    sites : any[] = ['Sousse','Mateur Sud','Mateur Nord','Manzel Hayet'];
    plants : any[] = ['BMW','VW','AUDI','MS1','MN1','MH1'];
constructor(private snackbar:MatSnackBar,
  private translate:TranslateService,private fb:FormBuilder,
  private router : Router
  ){}
  ngOnInit(): void {
    this.addSegmentForm = this.fb.group({
      'site' : ['',[Validators.required]],
      'plant' : ['',[Validators.required]],
      'segmentName' : ['',[Validators.required]],
      'linesNumber' : [0,[Validators.required]]
    });
  }
  addNewSegment(){
    this.snackbar
      .open(this.translate.instant('segementsContent.addSegmentForm.successAdd'), 'X', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'notif-success'
      })
      .afterDismissed().subscribe((res)=>{
        this.router.navigateByUrl('/dashboard/segments');
      });
  }
      /**
   * This gets the list of uploaded files from file uploader component
   * @param fileList
   */
      getUploadedFiles(fileList: IFile[]) {
        if(fileList.length > 0)
        {
          this.snackbar
          .open(this.translate.instant('segementsContent.addSegmentForm.successAdd'), 'X', {
            duration: 2000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: 'notif-success'
          })
          .afterDismissed().subscribe((res)=>{
            this.router.navigateByUrl('/dashboard/segments');
          });
        }
      }
}
