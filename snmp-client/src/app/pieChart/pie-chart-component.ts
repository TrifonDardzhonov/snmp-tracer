import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartSettings } from '../models/chartSettings';

@Component({
  selector: 'app-pie-chart', template: `
    <div [attr.id]="'pie-container'"></div>`
})
export class PieChartComponent implements AfterViewInit {

  @Input() data: any;
  @Input() settings: ChartSettings = {} as ChartSettings;
  @Output() selectGroup: EventEmitter<string> = new EventEmitter();

  // Now create the chart
  private options: Highcharts.Options = {
    chart: {
      plotBackgroundColor: undefined,
      plotBorderWidth: undefined,
      plotShadow: false,
      type: 'pie',
      renderTo: 'pie-container'
    }, title: {
      text: ''
    }, subtitle: {
      text: ''
    }, tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    }, plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            color: 'black'
          }
        }
      }, series: {
        events: {}
      }
    }, series: [{
      type: 'pie', name: 'SNMP', colorByPoint: true, data: []
    }]
  };

  ngAfterViewInit(): void {
    (this.options.subtitle as Highcharts.SubtitleOptions).text = this.settings.subtitle;
    ((this.options.series as Highcharts.SeriesOptionsType[])[0] as any).data = this.data;
    // @ts-ignore
    (this.options.plotOptions as Highcharts.PlotOptions).series.events.click = (event: any) => this.selectGroup.emit(event.point.name);
    Highcharts.chart(this.options);
    this.selectGroup.emit();
  }
}
