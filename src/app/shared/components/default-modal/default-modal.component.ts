import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-default-modal',
  templateUrl: './default-modal.component.html',
  styleUrls: ['./default-modal.component.scss']
})
export class DefaultModalComponent {
  chatDate: any;

  constructor(private dialogRef: MatDialogRef<DefaultModalComponent>, @Inject(MAT_DIALOG_DATA) public data: {
    message?: string,
    name?:string,
    title?: string,
    subMessage?: string,
    isForm? : boolean;
    formItems? : any[],
    isDeleteConfirmationModal?:boolean,
    buttons?: { text: string,type:string,isLoading?:boolean, handler: (evt: any) => boolean | undefined}[]
  }) {}

  runHandler(event: any, buttonConfig: any) {
    if(buttonConfig && typeof buttonConfig.handler === 'function') {
      const canClose = buttonConfig.handler(event);
      if(canClose) {
        this.dialogRef.close();
      }
    } else {
      this.dialogRef.close();
    }
  }

    chatDateChange(event) {
    this.chatDate = new Date(event.value).getDate() + '-' + new Date(event.value).getMonth() + '-' + new Date(event.value).getFullYear();
  }

}
