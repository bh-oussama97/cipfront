import { Component, OnInit } from '@angular/core';
import { MatSelectionListChange } from '@angular/material/list';
import { TranslateService } from '@ngx-translate/core';
import { DefaultModalComponent } from 'src/app/shared/components/default-modal/default-modal.component';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-app-setup',
  templateUrl: './app-setup.component.html',
  styleUrls: ['./app-setup.component.scss']
})
export class AppSetupComponent implements OnInit {

  configItems: string[] = ['applicationConfig.mailConfiguration'
    , 'applicationConfig.smsConfiguration',
    'applicationConfig.smsContent',
    'applicationConfig.emailContent',
    'applicationConfig.emailAddressConfiguration',
    'applicationConfig.ideasBlockage'];

  constructor(private modalService: ModalService, private translate: TranslateService) {

  }
  ngOnInit(): void {
  } 
  addProperty() { }
  openConfigDialog(item: string) {
    let clickedItem = item.split(".")[1];
    if (clickedItem === 'mailConfiguration') {

      this.modalService.create({
        component: DefaultModalComponent,
        title: this.translate.instant('applicationConfig.mailServiceDialog.title'),
        customModalClass : 'custom-modalbox',
        width : '50%',
        isDeleteConfirmationModal: false,
        isForm: true,
        formItems: [
          {
            label: this.translate.instant('applicationConfig.mailServiceDialog.host'),
            name: 'host',
            type: 'string'
          },
          {
            label: this.translate.instant('applicationConfig.mailServiceDialog.port'),
            name: 'port',
            type: 'number'
          },
          {
            label: this.translate.instant('applicationConfig.mailServiceDialog.password'),
            name: 'password',
            type: 'password'
          },
          {
            label: this.translate.instant('applicationConfig.mailServiceDialog.user'),
            name: 'user',
            type: 'text'
          }
        ],
        buttons: [
          {
            type: 'stroked',
            text: this.translate.instant('applicationConfig.mailServiceDialog.cancel'),
            handler: () => {
              return true;
            }
          },
          {
            type: 'flat',
            text: this.translate.instant('applicationConfig.mailServiceDialog.save'),
            handler: () => {
              return true;
            }
          }
        ]
      });
    }
    if (clickedItem === 'smsConfiguration') {
      this.modalService.create({
        component: DefaultModalComponent,
        title: this.translate.instant('applicationConfig.smsConfigDialog.title'),
        customModalClass : 'custom-modalbox',
        width : '50%',
        isDeleteConfirmationModal: false,
        isForm: true,
        formItems: [
          {
            label: this.translate.instant('applicationConfig.smsConfigDialog.key'),
            name: 'key',
            type: 'string'
          },
          {
            label: this.translate.instant('applicationConfig.smsConfigDialog.url'),
            name: 'url',
            type: 'string'
          }
        ],
        buttons: [
          {
            type: 'stroked',
            text: this.translate.instant('applicationConfig.smsConfigDialog.cancel'),
            handler: () => {
              return true;
            }
          },
          {
            type: 'flat',
            text: this.translate.instant('applicationConfig.smsConfigDialog.save'),
            handler: () => {
              return true;
            }
          }
        ]
      });
    }
    if (clickedItem === 'smsContent') {
      this.modalService.create({
        component: DefaultModalComponent,
        customModalClass : 'custom-modalbox',
        width : '50%',
        title: this.translate.instant('applicationConfig.smsContentconfigDialog.title'),
        isDeleteConfirmationModal: false,
        isForm: true,
        formItems: [
          {
            label: this.translate.instant('applicationConfig.smsContentconfigDialog.etat'),
            name: 'etat',
            type: 'select',
            items: ['applicationConfig.smsContentconfigDialog.reject',
              'applicationConfig.smsContentconfigDialog.selection',
              'applicationConfig.smsContentconfigDialog.execution',
              'applicationConfig.smsContentconfigDialog.retained']
          },
          {
            label: this.translate.instant('applicationConfig.smsContentconfigDialog.message'),
            name: 'message',
            placeholder: this.translate.instant('applicationConfig.smsContentconfigDialog.messagePlaceholder'),
            type: 'text'
          }
        ],
        buttons: [
          {
            type: 'stroked',
            text: this.translate.instant('applicationConfig.smsContentconfigDialog.annuler'),
            handler: () => {
              return true;
            }
          },
          {
            type: 'flat',
            text: this.translate.instant('applicationConfig.smsContentconfigDialog.save'),
            handler: () => {
              return true;
            }
          }
        ]
      });
    }

    if (clickedItem === 'emailContent') {
      this.modalService.create({
        component: DefaultModalComponent,
        customModalClass : 'custom-modalbox',
        width : '50%',
        title: this.translate.instant('applicationConfig.emailContentConfigDialog.title'),
        isDeleteConfirmationModal: false,
        isForm: true,
        formItems: [
          {
            label: this.translate.instant('applicationConfig.emailContentConfigDialog.destinataire'),
            name: 'recipient',
            type: 'select',
            items: ['applicationConfig.emailContentConfigDialog.chefSegment',
              'applicationConfig.emailContentConfigDialog.expert',
              'applicationConfig.emailContentConfigDialog.contreMaitre'
            ]
          },
          {
            label: this.translate.instant('applicationConfig.emailContentConfigDialog.etat'),
            name: 'state',
            type: 'select',
            items: ['applicationConfig.emailContentConfigDialog.reject',
              'applicationConfig.emailContentConfigDialog.selection',
              'applicationConfig.emailContentConfigDialog.execution',
              'applicationConfig.emailContentConfigDialog.retained'
            ]
          },
          {
            label: this.translate.instant('applicationConfig.emailContentConfigDialog.message'),
            name: 'message',
            type: 'text'
          }
        ],
        buttons: [
          {
            type: 'stroked',
            text: this.translate.instant('applicationConfig.emailContentConfigDialog.cancel'),
            handler: () => {
              return true;
            }
          },
          {
            type: 'flat',
            text: this.translate.instant('applicationConfig.emailContentConfigDialog.enregistrer'),
            handler: () => {
              return true;
            }
          }
        ]
      });
    }

    if (clickedItem === 'emailAddressConfiguration') {
      this.modalService.create({
        component: DefaultModalComponent,
        customModalClass : 'custom-modalbox',
        width : '50%',
        title: this.translate.instant('applicationConfig.emailAddressesConfigContent.title'),
        isDeleteConfirmationModal: false,
        isForm: true,
        formItems: [
          {
            label: this.translate.instant('applicationConfig.emailAddressesConfigContent.expediteur'),
            name: 'expediteur',
            type: 'email',
            placeholder: this.translate.instant('applicationConfig.emailAddressesConfigContent.adressePlaceholder'),
          },
          {
            label: this.translate.instant('applicationConfig.emailAddressesConfigContent.destinataire'),
            name: 'destinataire',
            type: 'select',
            items: ['applicationConfig.emailAddressesConfigContent.expert',
              'applicationConfig.emailAddressesConfigContent.chefSegment',
              'applicationConfig.emailAddressesConfigContent.contreMaitre'
            ]
          },
          {
            label: this.translate.instant('applicationConfig.emailAddressesConfigContent.adresse'),
            name: 'adresse',
            type: 'email',
            placeholder: this.translate.instant('applicationConfig.emailAddressesConfigContent.adressePlaceholder'),
          }
        ],
        buttons: [
          {
            type: 'stroked',
            text: this.translate.instant('applicationConfig.emailAddressesConfigContent.cancel'),
            handler: () => {
              return true;
            }
          },
          {
            type: 'flat',
            text: this.translate.instant('applicationConfig.emailAddressesConfigContent.enregistrer'),
            handler: () => {
              return true;
            }
          }
        ]
      });
    }

    if (clickedItem === 'ideasBlockage') {

      this.modalService.create({
        component: DefaultModalComponent,
        customModalClass : 'custom-modalbox',
        width : '50%',
        title: this.translate.instant('applicationConfig.ideasBlockingDateContent.title'),
        isDeleteConfirmationModal: false,
        isForm: true,
        formItems: [
          {
            label: this.translate.instant('applicationConfig.ideasBlockingDateContent.start'),
            name: 'timeSlotStart',
            type: 'date'
          },
          {
            label: this.translate.instant('applicationConfig.ideasBlockingDateContent.end'),
            name: 'timeSlotEnd',
            type: 'date'
          }
        ],
        buttons: [
          {
            type: 'stroked',
            text: this.translate.instant('applicationConfig.ideasBlockingDateContent.cancel'),
            handler: () => {
              return true;
            }
          },
          {
            type: 'flat',
            text: this.translate.instant('applicationConfig.ideasBlockingDateContent.save'),
            handler: () => {
              return true;
            }
          }
        ]
      });
    }
  }
}
