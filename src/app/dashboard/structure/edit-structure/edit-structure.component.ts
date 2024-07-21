import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-structure',
  templateUrl: './edit-structure.component.html',
  styleUrls: ['./edit-structure.component.scss']
})
export class EditStructureComponent implements OnInit{
  sites : any[] = ['Sousse','Mateur Sud','Mateur Nord','Manzel Hayet'];
  editSiteForm:FormGroup;
  constructor(private fb:FormBuilder,private snackbar: MatSnackBar,
    private translate: TranslateService,private router : Router
    ){}
  ngOnInit(): void {
    this.editSiteForm = this.fb.group({
      siteName : [''],
      linesNumber : [0],
      segmentsNumber : [0],
      plantsNumber : [0],
    })
  }
  editSite(){
    this.snackbar
    .open(this.translate.instant('structureContent.editSiteForm.successModification'), 'X', {
      duration: 5000,
      horizontalPosition : 'center',
      verticalPosition : 'top',
      panelClass: 'notif-success'
    })
    .afterDismissed()
    .subscribe(res=>{
      this.router.navigateByUrl('/dashboard/structure');
    });
  }
}
