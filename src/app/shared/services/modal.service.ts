import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DefaultModalComponent } from '../components/default-modal/default-modal.component';


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog) { }

  create(config: {
    name?: string,
    message?: string,
    title?: string,
    isDeleteConfirmationModal?: boolean,
    subMessage?: string,
    isForm?: boolean,
    formItems?: any[],
    width?: string,
    height?: string,
    customModalClass?: string,
    buttons?: { text: string, type?: string, handler: (evt: any) => boolean | undefined }[],
    component?: ComponentType<any>
  }) {
    let component = config.component || DefaultModalComponent;
    if (!config.component) {
      throw new Error('Either a message or Dialog component is required');
    }

    const { name, isDeleteConfirmationModal, message, title, subMessage, buttons, isForm, formItems, width, height,customModalClass } = config;
    const data = {
      name,
      isDeleteConfirmationModal,
      message,
      title,
      subMessage,
      buttons,
      isForm,
      formItems
    };
    return this.dialog.open(component, {
      data,
      minWidth: width,
      minHeight: height,
      panelClass: customModalClass
    });
  }
}
