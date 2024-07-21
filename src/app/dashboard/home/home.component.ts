import { Component, OnInit } from '@angular/core';
import { faDownload, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Chart, registerables } from 'chart.js';
import { DateTime } from 'luxon';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TranslateService } from '@ngx-translate/core';
import { FileService } from 'src/app/shared/services/file.service';

Chart.register(...registerables);
Chart.register(ChartDataLabels);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  fasearch = faSearch;
  totalIdeasNumberChart: Chart;
  ideesTraiteePerUserChart: Chart;
  ideasStateChart: any;
  periodSelected: string = '';
  gradientBorder: boolean = true;
  siteLabels: string[] = ['Mateur Sud', 'Mateur Nord', 'Manzel Hayet', 'Sousse'];
  usersLabels: string[] = ['Nermine', 'Mouna', 'Islem', 'Oussama'];
  monthsData: number[] = [65, 59, 80, 81, 56, 55, 40];
  periods: string[] = [];
  fadownload = faDownload;

  constructor(private translate: TranslateService,private fileService : FileService) { }
  ngOnInit(): void {
    let startOfMonthDate = DateTime.now().startOf('month').toFormat("dd/MM/yyyy");
    let endOfMonthDate = DateTime.now().endOf('month').toFormat("dd/MM/yyyy");
    this.periodSelected = startOfMonthDate + "-" + endOfMonthDate;
    let currentYear = DateTime.now().year;
    for (let month = 1; month <= 12; month++) {
      let startOfMonth = DateTime.local(currentYear, month, 1).startOf('month').toFormat("dd/MM/yyyy");
      let endOfMonth = DateTime.local(currentYear, month, 1).endOf('month').toFormat("dd/MM/yyyy");

      let dateToPush = startOfMonth + "-" + endOfMonth;
      if (dateToPush !== this.periodSelected) {
        this.periods.push(startOfMonth + "-" + endOfMonth);
      }
    }
    this.renderChart();
  }

  renderChart() {
    this.ideesTraiteePerUserChart = new Chart('ideesTraiteePerUserChart', {
      type: 'bar',
      data: {

        labels: this.usersLabels,
        datasets: [{
          label: this.translate.instant('dashboardContent.cipPerUser'),
          data: [28, 31, 35, 39],
          backgroundColor: [
            '#77B551'
          ],
          borderColor: [
            '#77B551'
          ],
          borderWidth: 1,

        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    });
    this.totalIdeasNumberChart = new Chart("ideasTotalNumberChart", {
      type: 'bar',
      data: {

        labels: this.siteLabels,
        datasets: [{
          label: this.translate.instant('dashboardContent.ideasTotalNumber'),
          data: [10, 25, 30, 39],
          backgroundColor: [
            'rgb(62, 112, 202)'
          ],
          borderColor: [
            'rgb(62, 112, 202)'
          ],
          borderWidth: 1,

        }]
      },
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
    })
    this.ideasStateChart = new Chart("ideasStateChart", {
      type: 'pie',
      data: {
        labels: [
          this.translate.instant('dashboardContent.preSelection'),
          this.translate.instant('dashboardContent.selection'),
          this.translate.instant('dashboardContent.executed'),
          this.translate.instant('dashboardContent.onHold'),
          this.translate.instant('dashboardContent.denied'),
          this.translate.instant('dashboardContent.valid')
        ],
        datasets: [{
          label: '',
          data: [12, 18, 26, 50, 32, 10],
          backgroundColor: [
            '#547CCB',
            '#F47926',
            '#A9A9A9',
            '#5097D6',
            '#6CAE3F',
            '#F5C000'
          ],
          hoverOffset: 4
        }
        ],
      },
      options: {
        layout: {
          padding: {
            top: 30,
            left: 0,
            right: 0,
            bottom: 30
          }
        },
        responsive: true,
        // cutout: '70%',

        aspectRatio: 2,
        animation: {
          animateScale: true,
          animateRotate: true
        },
        plugins: {
          colors: {
            forceOverride: true,
          },
          legend: {
            display: true,
            align: 'center',
            position: 'bottom',
            labels: {
              boxPadding: 3,
              padding: 30,
              textAlign: 'center',
              usePointStyle: true,
              pointStyle: 'rect',
              font: {
                size: 14,
                family: "'Hemi Head,Bold Italic'"
              }
            },
          },
          tooltip: {
            bodyAlign: 'center',
            enabled: false,
            titleColor: '#fff'

          },

          datalabels: {
            clamp: true,
            align: 'end',
            display: true,
            anchor: 'end',
            color: 'black',
            formatter: (value, ctx) => {
              return ctx.chart.data.labels?.[ctx.dataIndex] + " : " + value
            },

          },

        },
      }
    });
  }

  onValueSelected(selected: string) {
    this.periodSelected = selected;
  }

  exportAsPDF(elementId:string) {
    this.fileService.exportContentPDF(elementId,this.periodSelected);
  }

  downloadChart(chartid: string) {
   this.fileService.exportChartToExcel(chartid);
  }

}
