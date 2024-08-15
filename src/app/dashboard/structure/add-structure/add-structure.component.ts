import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
    private structureService : StructureService,
    private translate : TranslateService
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

    if(this.addSiteForm.valid)
    {
      this.snackbar.open(this.translate.instant("structureContent.addSite.errorMessage"),'',
      {
        duration: 2000,
        horizontalPosition : 'right',
        verticalPosition : 'top',
        panelClass: 'notification-error'
      })
    }
    else{
      this.structureService.addNewSite(siteToSave).subscribe(
        {next:(response:ResponseDto)=>{
          if(response !== null)
            {
              this.snackbar
              .open(response.message, '', {
                duration: 2000,
                horizontalPosition : 'right',
                verticalPosition : 'top',
                panelClass: 'notification-success'
              })
              .afterDismissed().subscribe((res)=>{
                this.router.navigateByUrl('/structure');
              });
            }
        }, error: (httpError: HttpErrorResponse) => {
          let responseError: ResponseDto = httpError.error;
          this.snackbar
            .open(responseError.message, '', {
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
}
