import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonTableComponent } from './components/common-table/common-table.component';
import { MaterialModule } from './modules/material/material.module';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditDeleteButtonsComponent } from './components/edit-delete-buttons/edit-delete-buttons.component';
import { DefaultModalComponent } from './components/default-modal/default-modal.component';
import { ModalService } from './services/modal.service';
import { FooterComponent } from './components/footer/footer.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgChartsModule } from 'ng2-charts';
import {BreadcrumbModule} from 'xng-breadcrumb';
import { AccountComponent } from '../account/account.component';
import {CdkDrag} from '@angular/cdk/drag-drop';
import { DndDirective } from './directives/dnd.directive';
import { DetailsButtonComponent } from './components/details-button/details-button.component';
import { EditDeactivateButtonsComponent } from './components/edit-deactivate-buttons/edit-deactivate-buttons.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { EditDetailsActionsComponent } from './components/edit-details-actions/edit-details-actions.component';
import { ImportKaizenCardModalComponent } from './components/import-kaizen-card-modal/import-kaizen-card-modal.component';
import { KaizenCardBeforeAfterModalComponent } from './components/kaizen-card-before-after-modal/kaizen-card-before-after-modal.component';
import { SelectExpertModalComponent } from './components/select-expert-modal/select-expert-modal.component';
import { NgxLoadingButtonsModule } from 'ngx-loading-buttons';
import { OpenKaizenImageComponent } from './components/open-kaizen-image/open-kaizen-image.component';
import { AssignIdeaChefSegmentComponent } from './components/assign-idea-chef-segment/assign-idea-chef-segment.component';
import { EditButtonComponent } from './components/edit-button/edit-button.component';
import { OnlynumberDirective } from './directives/onlynumber.directive';

@NgModule({
  declarations: [
    CommonTableComponent,
    HeaderComponent,
    EditDeleteButtonsComponent,
    DefaultModalComponent,
    FooterComponent,
    AccountComponent,
    DndDirective,
    DetailsButtonComponent,
    EditDeactivateButtonsComponent,
    FileUploaderComponent,
    EditDetailsActionsComponent,
    ImportKaizenCardModalComponent,
    KaizenCardBeforeAfterModalComponent,
    SelectExpertModalComponent,
    OpenKaizenImageComponent,
    AssignIdeaChefSegmentComponent,
    EditButtonComponent,
    OnlynumberDirective
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    TranslateModule,
    FormsModule,
    FontAwesomeModule,
    NgChartsModule,
    BreadcrumbModule,
    CdkDrag,
    NgxLoadingButtonsModule
  ],
  providers : [ModalService],
  exports : [
    MaterialModule,
    HeaderComponent,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    CommonTableComponent,
    EditDeleteButtonsComponent,
    FontAwesomeModule,
    NgChartsModule,
    FooterComponent,
    BreadcrumbModule,
    DndDirective,
    DetailsButtonComponent,
    FileUploaderComponent,
    EditDetailsActionsComponent,
    NgxLoadingButtonsModule,
    EditButtonComponent,
    OnlynumberDirective
  ]
  })
export class SharedModule { }
