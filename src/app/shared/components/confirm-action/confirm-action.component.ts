import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { faEye } from '@fortawesome/free-regular-svg-icons';
import { TableButtonAction } from '../../interfaces/table-button-action';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';

@Component({
  selector: '[confirm-action]',
  templateUrl: './confirm-action.component.html',
  styleUrls: ['./confirm-action.component.scss'],
})
export class ConfirmActionComponent implements OnInit, OnDestroy {
  faDetails = faEye;
  @Input() value: string;
  subscription: Subscription;
  confirmValue: boolean = false;
  @Output() confirmAction: EventEmitter<TableButtonAction> =
    new EventEmitter<TableButtonAction>();
  constructor(private dataservice: DataService) {}

  ngOnInit(): void {
    this.confirmValue = false;
    this.subscription = this.dataservice.getConfirmValue$.subscribe({
      next: (value: boolean) => {
        if(value !== null)
        {
          this.confirmValue = value;
        }
      },
    });
  }
  confirmClick(event) {
    this.confirmValue = event.checked;
    if (event.checked) {
      this.confirmAction.emit({
        name: 'confirm',
        value: this.value,
      });
    }
  }
  detailsClick() {
    this.confirmAction.emit({
      name: 'details',
      value: this.value,
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
