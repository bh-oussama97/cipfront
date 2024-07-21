import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faPerson } from '@fortawesome/free-solid-svg-icons';
import { TableButtonAction } from '../../interfaces/table-button-action';
import { faEye } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: '[details-button]',
  templateUrl: './details-button.component.html',
  styleUrls: ['./details-button.component.scss']
})
export class DetailsButtonComponent {
  detailsIcon = faPerson;
  faDetails = faEye;
  @Input() value: string;
  @Output() buttonAction: EventEmitter<TableButtonAction> = new EventEmitter<TableButtonAction>();
  detailsClick(){
    this.buttonAction.emit({
      name: 'details',
      value: this.value,
    });
  }
}
