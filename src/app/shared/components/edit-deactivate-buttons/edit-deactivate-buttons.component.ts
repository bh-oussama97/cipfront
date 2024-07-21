import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faBan, faClose, faPenToSquare, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { TableButtonAction } from '../../interfaces/table-button-action';

@Component({
  selector: '[edit-deactivate-buttons]',
  templateUrl: './edit-deactivate-buttons.component.html',
  styleUrls: ['./edit-deactivate-buttons.component.scss']
})
export class EditDeactivateButtonsComponent {
  faBlock = faClose;
  faPencilSquare = faPencilAlt;
  
  @Input() value: string;
  @Output() EditDeactivateAction: EventEmitter<TableButtonAction> = new EventEmitter<TableButtonAction>();
  editClick(){
    this.EditDeactivateAction.emit({
      name: 'edit',
      value: this.value,
    });
  }
  deactivateClick(){
    this.EditDeactivateAction.emit({
      name: 'deactivate',
      value: this.value,
    });
  }
}
