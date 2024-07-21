import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TableButtonAction } from '../../interfaces/table-button-action';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: '[edit-button]',
  templateUrl: './edit-button.component.html',
  styleUrls: ['./edit-button.component.scss']
})
export class EditButtonComponent {
  faPencilSquare = faPencilAlt;

  @Input() value: string;
  @Output() editAction: EventEmitter<TableButtonAction> = new EventEmitter<TableButtonAction>();
  editClick(){
    this.editAction.emit({
      name: 'edit',
      value: this.value,
    });
  }
}
