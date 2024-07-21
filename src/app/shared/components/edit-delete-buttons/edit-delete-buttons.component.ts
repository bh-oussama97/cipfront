import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableButtonAction } from '../../interfaces/table-button-action';
import { faPenToSquare, faPencil, faPencilRuler } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: '[edit-delete-buttons]',
  templateUrl: './edit-delete-buttons.component.html',
  styleUrls: ['./edit-delete-buttons.component.scss']
})
export class EditDeleteButtonsComponent {

  faTrash = faTrashAlt;
  faEdit = faPencil;

  @Input() value: string;
  @Output() buttonAction: EventEmitter<TableButtonAction> =
    new EventEmitter<TableButtonAction>();


  editClick() {
    this.buttonAction.emit({
      name: 'edit',
      value: this.value,
    });
  }
  deleteClick() {
    this.buttonAction.emit({
      name: 'delete',
      value: this.value,
    });
  }
}
