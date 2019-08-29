import { RentHistoryInfo, TransactionsService } from '../../transactions/transactions.service';
import { Component, OnInit, Input } from '@angular/core';
import { Moment }            from 'moment';
import {  ActivityFeedInfo } from '../../activity-feed/services/activity-feed.service';
import {TenancyService, TenancyInfo}    from '../../renting-card/services/tenancy.service';
import { PortalSession } from '../../_common/portal-session';
declare let Chart: any;
import * as moment from 'moment';
@Component({
  selector: 'app-payment-history-chart',
  templateUrl: './payment-history-chart.component.html',
  styleUrls: ['./payment-history-chart.component.scss']
})
export class PaymentHistoryChartComponent implements OnInit {
  @Input() startDate: Date;
  @Input() toDate: Date;
  @Input() label: Date;
  isLoaded: boolean;
  currentTenancy: TenancyInfo;
  rentHistories: RentHistoryInfo[];
  rentAmounts: number[];
  rentDates: string[];
  myChart: any;
  showMessage: boolean;
  message: string;


  constructor(
    private tenancyService: TenancyService,
    private transactionService: TransactionsService,
    private portalSession: PortalSession
  ) { }

  ngOnInit() {
    const serverFormat = 'YYYY-MM-DD';
    const noDataMessage = 'There are no transactions to display. This graph is updated overnight, any transactions processed today will be displaying tomorrow';
    const defaultMessage = 'This graph does not include today\'s receipts';

    if (!this.toDate) {
      this.toDate =  new Date();
    }

    if (!this.startDate) {
      this.startDate = moment(new Date()).add(-3, 'M').toDate();
    }
    this.showMessage = false;
    this.tenancyService.getCurrentTenant()
      .then(t => {
        this.currentTenancy = t;

        if (this.currentTenancy) {
          this.transactionService.getRentHistory(moment(this.startDate).format(serverFormat),
            moment(this.toDate).format(serverFormat))
            .then( rent => {
              if (rent && rent.List) {
                this.rentHistories = rent.List;
                this.rentAmounts = this.rentHistories.map(function (rentHistory){
                  return rentHistory.Amount;
                });

                this.rentDates = this.rentHistories.map(function (rentHistory) {
                  return moment(rentHistory.DueDate).format('DD/MM/YYYY');
                });

                if (!this.rentDates || this.rentDates.length === 0 ) {
                  this.showMessage = true;
                  this.message = noDataMessage;
                  this.rentDates.push(moment(this.startDate).format('DD/MM/YYYY'));
                  this.rentDates.push(moment(this.toDate).format('DD/MM/YYYY'));
                } else {
                    this.showMessage = true;
                    this.message = defaultMessage;
                }

                this.loadChart().then(res => this.chartDatasetOverride());

                this.isLoaded = false;

              }else {
                this.isLoaded = false;
                this.showMessage = true;
                this.message = noDataMessage;
              }
            });
        }else {
          this.isLoaded = false;
          this.showMessage = true;
          this.message = noDataMessage;
        }
      })
      .catch(err => {
        this.isLoaded = true;
        this.message = null;
      });
  }



  loadChart() {

      return new Promise((resolve, reject) => {
          const canvas: any = document.getElementById('myChart');
          if (canvas) {
              const ctx = canvas.getContext('2d');
              const data = this.rentAmounts && this.rentAmounts.length > 0 ? this.rentAmounts : [];

              const options = {
                  datasetFill: true,
                  responsive: true,
                  maintainAspectRatio: false,
                  elements: {
                      line: {
                          tension: 0
                      },
                      point: {
                          radius: 0
                      }
                  },
                  scales: {
                      yAxes: [{
                          scaleLabel: {
                              display: this.label ? true : false,
                              labelString: this.label
                          },
                          ticks: {
                              beginAtZero: true
                          }
                      }],
                      xAxes: [{
                          ticks: {
                              beginAtZero: true
                          },
                          gridLines: {},
                          time: {}
                      }]
                  },
                  legend: {
                      position: 'none'
                  },
                  hover: {},
                  tooltips: {
                      enabled: false,
                      callbacks: {}
                  }
              };

              this.enableTimeSeries(options);

              this.myChart = new Chart(ctx, {
                  type: 'line',
                  data: {
                      labels: this.rentDates,
                      datasets: [{
                          label: 'Payment',
                          yAxisID : 'y-axis-0',
                          fill: true,
                          data: data
                      }]
                  },
                  options: options
              });
          }

          resolve();
      });



  }

  enableTimeSeries(chartOptions: any) {
      const dayFormat = this.portalSession && this.portalSession.defaultAgent ?
        this.portalSession.defaultAgent.RegionSetting.DateFormat.toUpperCase() : 'D/MM/YYYY';

      // chartOptions.scales.xAxes[0].type = 'time';
      chartOptions.scales.xAxes[0].gridLines.display = false;
      chartOptions.scales.xAxes[0].ticks.beginAtZero = true;
      // chartOptions.scales.xAxes[0].ticks.maxRotation = 0;
      chartOptions.scales.xAxes[0].ticks.autoSkip = true;
      chartOptions.scales.xAxes[0].ticks.autoSkipPadding = 35;
      chartOptions.scales.xAxes[0].time.tooltipFormat = dayFormat;
      chartOptions.scales.xAxes[0].time.displayFormats =  {
          day: dayFormat,
          week: dayFormat,
          month: dayFormat
      };
      return this;
  };


  chartDatasetOverride() {
    if (this.rentAmounts && this.rentAmounts.length > 0 && this.myChart) {
      const min = Math.min.apply(null, this.rentAmounts);
      const max = Math.max.apply(null, this.rentAmounts);
      const yScale = this.myChart.scales['y-axis-0'];

      const zero = yScale.getPixelForValue(0);
      const top = Math.min(yScale.getPixelForValue(max), zero);
      const bottom = Math.max(yScale.getPixelForValue(min), zero);
      const ctx = this.myChart.chart.ctx;

      const gradient = ctx.createLinearGradient(0, top, 0, bottom);
      const ratio = (zero - top) / (bottom - top);

      gradient.addColorStop(0, 'rgba(165,200,50,0.2)');
      gradient.addColorStop(ratio, 'rgba(165,200,50,0.2)');
      gradient.addColorStop(ratio, 'rgba(240,70,35,0.2)');
      gradient.addColorStop(1, 'rgba(240,70,35,0.2)');

      this.myChart.data.datasets[0].backgroundColor = gradient;

      this.myChart.update();
    }
  }



}

