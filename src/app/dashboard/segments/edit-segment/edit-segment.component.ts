import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-segment',
  templateUrl: './edit-segment.component.html',
  styleUrls: ['./edit-segment.component.scss']
})
export class EditSegmentComponent implements OnInit{

  editSegmentForm:FormGroup;
  sites : any[] = ['Sousse','Mateur Sud','Mateur Nord','Manzel Hayet'];
  plants : any[] = ['BMW','VW','AUDI','MS1','MN1','MH1'];
  constructor(private fb:FormBuilder,private snackbar:MatSnackBar,private translate:TranslateService,private router  : Router){

  }
  ngOnInit(): void {
    this.editSegmentForm = this.fb.group({
      site: [''],
      plant: [''],
      segmentName : [''],
      linesNumber: [0],
    });
  }
  editSegment(){
    this.snackbar
    .open(this.translate.instant('segementsContent.editSegmentForm.successModification'), 'X', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'notif-success'
    })
    .afterDismissed()
    .subscribe(res=>{
      this.router.navigateByUrl('/dashboard/sites');
    });
  }
}
