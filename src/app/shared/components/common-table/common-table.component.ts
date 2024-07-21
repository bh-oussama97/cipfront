import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { TableColumn } from '../../interfaces/table-column';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { TableButtonAction } from '../../interfaces/table-button-action';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'common-table',
  templateUrl: './common-table.component.html',
  styleUrls: ['./common-table.component.scss']
})
export class CommonTableComponent implements OnInit {

  @Input()
  tableColumns: Array<TableColumn> = [];

  _dataSource;
  @Input()
  set dataSource(v) {
    this._dataSource = v;
    this.initializeDataSource();
  }
  get dataSource() {
    return this._dataSource;
  }
  @Input() role: string;


  @Input() editDeleteActions: boolean = false;
  @Input() detailsAction: boolean = false;
  @Input() editDeactivateActions: boolean = false;
  @Input() editAction: boolean = false;
  @Input() editDetailsActions: boolean = false;

  @Output() action: EventEmitter<TableButtonAction> =
    new EventEmitter<TableButtonAction>();
  displayedColumns: Array<string> = [];
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @Input() assignAction: boolean = false;
  @Output() saveAction: EventEmitter<any> =
    new EventEmitter<any>();
  @Input() isEvenRowsChangeColor: boolean = false;
  DataSource: MatTableDataSource<any>;

  newdataSource: MatTableDataSource<any> = new MatTableDataSource();
  length: number = 0;
  pageSize: number
  @Input() isShowPaginator: boolean = true;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor() { }

  ngOnInit(): void {
    this.displayedColumns = this.tableColumns.map((c) => c.columnDef);
    if (this.role === 'CONTRE_MAITRE' && this.detailsAction === true) {
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'chefSegment' && column !== 'contreMaitre' && column !== 'expert' && column !== "fullName")
      // this.displayedColumns.push('edit-details-actions');
      this.displayedColumns.push('details-action');

    }
    if (this.role === 'CHEF_SEGMENT' && this.detailsAction === true) {
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'chefSegment');
      // this.displayedColumns.push('edit-details-actions');
      this.displayedColumns.push('details-action');

    }
    if (this.role === 'EXPERT' && this.detailsAction === true) {
      this.displayedColumns = this.displayedColumns.filter(column => column !== 'contreMaitre' && column !== 'expert' && column != 'fullName');
      // this.displayedColumns.push('edit-details-actions');
      this.displayedColumns.push('details-action');

    }
    if (this.role === 'OPEX' && this.detailsAction === true) {
      this.displayedColumns.push('details-action');
    }
    if (this.editDeleteActions === true) {
      this.displayedColumns.push('edit-delete-action');
    }

    if (this.editDeactivateActions === true) {
      this.displayedColumns.push('edit-deactivate-actions');
    }
    if(this.editAction === true)
    {
      this.displayedColumns.push('edit-action');
    }

    if(this.editDetailsActions === true)
    {
      this.displayedColumns.push('edit-details-actions');

    }
    this.initializeDataSource();
  }


  initializeDataSource() {

    if (this.isShowPaginator === true) {
      this.DataSource = new MatTableDataSource<any>(this.dataSource);
      this.newdataSource = new MatTableDataSource<any>(this.dataSource);
      // this.newdataSource.data = this.dataSource.data.slice(0, this.pageSize);
      this.newdataSource.paginator = this.paginator;
      this.newdataSource.sort = this.sort;
      this.length = this.DataSource.data.length;
    }
    else {
      this.newdataSource = new MatTableDataSource<any>(this.dataSource);
      this.newdataSource.sort = this.sort;
    }

  }

  sortData(sort: Sort) {
    const data = [...this.dataSource.data];
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    const sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';

      const activeColumn = sort.active;
      return isAsc
        ? a[activeColumn].localeCompare(b[activeColumn])
        : b[activeColumn].localeCompare(a[activeColumn]);
    });

    this.dataSource.data = sortedData;
  }
  onTableAction(e: TableButtonAction, element: any): void {
    e.value = element;
    this.action.emit(e);
  }

  saveRow(event: Event) {
    this.saveAction.emit(event)
  }

  getPaginatorData(event: PageEvent) {
    let startIndex = event.pageIndex * event.pageSize;
    let endIndex = startIndex + event.pageSize;
    if (endIndex > this.length) {
      endIndex = this.length;
    }
    this.newdataSource.data = this.DataSource.data.slice(startIndex, endIndex);
  }

}
