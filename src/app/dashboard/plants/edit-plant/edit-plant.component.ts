import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-plant',
  templateUrl: './edit-plant.component.html',
  styleUrls: ['./edit-plant.component.scss']
})
export class EditPlantComponent implements OnInit {

  editPlantForm: FormGroup;
  sites : any[] = ['Sousse','Mateur Sud','Mateur Nord','Manzel Hayet'];

  constructor(private fb: FormBuilder, private snackbar: MatSnackBar, private translate: TranslateService,private router : Router) {

  }
  ngOnInit(): void {
    this.editPlantForm = this.fb.group({
      siteName: [''],
      plantName: [''],
      segmentsNumber: [0],
    });
  }
  editPlant() {
    this.snackbar
      .open(this.translate.instant('plantContent.editPlantForm.successModification'), 'X', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: 'notif-success'
      })
      .afterDismissed()
      .subscribe(res=>{
        this.router.navigateByUrl('/dashboard/plants');
      });
  }
}
