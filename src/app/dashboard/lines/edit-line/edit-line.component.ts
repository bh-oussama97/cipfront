import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-line',
  templateUrl: './edit-line.component.html',
  styleUrls: ['./edit-line.component.scss']
})
export class EditLineComponent implements OnInit{
  editLineForm:FormGroup;
  sites : any[] = ['Sousse','Mateur Sud','Mateur Nord','Manzel Hayet'];
  plants : any[] = ['BMW','VW','AUDI','MS1','MN1','MH1'];
  segments : any[] = ['Cutting & WPA MEB AUTARK','Segment 45','Segment 59','Segment 53-1','Cutting & WPA SYSAPP LTN1','Segment Muster SYSAPP'];
  constructor(private fb:FormBuilder,private snackbar:MatSnackBar,
    private translate:TranslateService,
    private router : Router
    ){
  }

  ngOnInit() {
    this.editLineForm = this.fb.group({
      siteName: [''],
      plantName: [''],
      segmentLineName : [''],
      lineName: [''],
    });
  }

  editLine(){
    this.snackbar
      .open(this.translate.instant('linesContent.editLineForm.successModification'), '', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'notification-success'
      })
      .afterDismissed()
      .subscribe((res) => {
        this.router.navigateByUrl('lines');
      });
  }
}
