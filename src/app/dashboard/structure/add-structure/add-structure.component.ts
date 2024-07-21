import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ResponseDto } from 'src/app/shared/interfaces/response-dto';
import { SiteDto } from 'src/app/shared/interfaces/site-dto';
import { StructureService } from 'src/app/shared/services/structure.service';

@Component({
  selector: 'app-add-structure',
  templateUrl: './add-structure.component.html',
  styleUrls: ['./add-structure.component.scss']
})
export class AddStructureComponent {
  addSiteForm:FormGroup;
  constructor(private fb:FormBuilder,private snackbar: MatSnackBar,
    private router : Router,
    private structureService : StructureService
    ){}
  ngOnInit(): void {
    this.addSiteForm = this.fb.group({
      organisation : ['']
    })
  }
  addNewSite(){        
    const siteToSave  : SiteDto = {
      name: this.addSiteForm.value.organisation
    }
    this.structureService.addNewSite(siteToSave).subscribe(
      {next:(response:ResponseDto)=>{
        if(response !== null)
          {
            this.snackbar
            .open(response.message, 'X', {
              duration: 2000,
              horizontalPosition : 'center',
              verticalPosition : 'top',
              panelClass: 'notif-success'
            })
            .afterDismissed().subscribe((res)=>{
              this.router.navigateByUrl('/dashboard/structure');
            });
          }
      }, error: (httpError: HttpErrorResponse) => {
        let responseError: ResponseDto = httpError.error;
        this.snackbar
          .open(responseError.message, 'X', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'notification-error'
          })
          .afterDismissed().subscribe((res) => {
            this.addSiteForm.reset();
          });
      }});
  }
}
