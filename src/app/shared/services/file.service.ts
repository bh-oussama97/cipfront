import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Chart } from 'chart.js';
import * as Excel from 'exceljs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WorksheetColumn } from 'src/app/shared/interfaces/worksheet-column';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private httpClient: HttpClient) {}
  EXCEL_TYPE =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  EXCEL_EXTENSION = '.xlsx';
  exportTemplateXLSX(
    sheetName: string,
    columns: WorksheetColumn[],
    filenameOutput: string
  ) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = columns;
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell(function (cell, colNumber) {
        cell.font = {
          name: 'Arial',
          family: 2,
          bold: false,
          size: 30,
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
        };

        if (rowNumber === 1) {
          row.height = 20;
          cell.font = {
            bold: true,
          };
        }
      });
    });
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, filenameOutput);
    });
  }

  exportTableXLSX(
    sheetName: string,
    columns: WorksheetColumn[],
    filenameOutput: string,
    dataSource: any[]
  ) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet(sheetName);
    worksheet.columns = columns;
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell(function (cell, colNumber) {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.font = {
          name: 'Arial',
          family: 2,
          bold: false,
          size: 30,
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'left',
        };

        if (rowNumber === 1) {
          row.height = 20;
          cell.font = {
            bold: true,
          };
        }
      });
    });
    dataSource.forEach((e) => {
      worksheet.addRow(e);
    });

    // Apply styling to each cell in the sheet
    worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, filenameOutput);
    });
  }

  exportChartToExcel(chartid: string) {
    let chartById = Chart.getChart(chartid);
    let labels: any[] = chartById.data.labels;
    let datasets = chartById.data.datasets[0].data;
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet(chartid + 'Sheet');
    worksheet.columns = labels.map((label) => {
      return {
        header: label,
        width: 25,
      };
    });
    worksheet.addRow(datasets);
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) {
        row.font = {
          bold: true,
        };
      }
      row.alignment = {
        vertical: 'middle',
        horizontal: 'center',
      };
      row.height = 20;
    });
    workbook.xlsx.writeBuffer().then((datasets) => {
      let blob = new Blob([datasets], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, chartid + '.xlsx');
    });
  }

  exportContentPDF(elementId: string, filename: string) {
    let DATA: any = document.getElementById(elementId);
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 180;
      let fileHeight = 280;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'A4');
      let position = 10;
      PDF.addImage(FILEURI, 'PNG', position, position, fileWidth, fileHeight);
      PDF.save(filename + '.pdf'); // Generated PDF
    });
  }
  uploadKaizenCard(formData: FormData): Observable<any> {
    return this.httpClient.post(environment.apiUrl + '/upload', formData);
  }

  downloadFileByName(filename: string) {
    return this.httpClient.get(
      environment.apiUrl + '/files?filename=' + filename,
      { responseType: 'blob' }
    );
  }

  isValidSize(size: number): boolean {
    const toKByte = size / 1024;
    return toKByte <= 2048;
  }

  saveAsExcelFile(res: Blob, fileName: string): void {
    const blob = new Blob([res], { type: 'application/vnd.ms.excel' });
    const file = new File([blob], fileName + '.xlsx', {
      type: 'application/vnd.ms.excel',
    });
    saveAs(file);
  }

  uploadEmployees(formData:FormData) :Observable<HttpResponse<any>>
  {
    return this.httpClient.post<HttpResponse<any>>(environment.apiUrl + '/upload/employees',formData);
  }
  uploadUsers(formData:FormData) :Observable<HttpResponse<any>>
  {
    return this.httpClient.post<HttpResponse<any>>(environment.apiUrl + '/upload/users',formData);
  }

  excelMassifUpload(data:FormData) :Observable<HttpResponse<any>>
  {
    return this.httpClient.post<HttpResponse<any>>(environment.apiUrl+"/upload/structures",data);
  }
}
