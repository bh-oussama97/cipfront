import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faEye, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import { TableButtonAction } from '../../interfaces/table-button-action';
import { faPencil, faPencilAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: '[edit-details-actions]',
  templateUrl: './edit-details-actions.component.html',
  styleUrls: ['./edit-details-actions.component.scss']
})
export class EditDetailsActionsComponent {
  faPencilSquare = faPencilAlt;
  faDetails = faEye;
  @Input() value: string;
  @Output() editDetailsAction: EventEmitter<TableButtonAction> = new EventEmitter<TableButtonAction>();
  editClick(){
    this.editDetailsAction.emit({
      name: 'edit',
      value: this.value,
    });
  }
  detailsClick(){
    this.editDetailsAction.emit({
      name: 'details',
      value: this.value,
    });
  }
}
