import { Component, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartSettings } from '../models/chartSettings';

@Component({
    selector: 'app-pie-chart',
    template: `<div [attr.id]="'pie-container-' + settings.index"></div>`
})
export class PieChartComponent implements AfterViewInit {

    @Input() set: any;
    @Input() settings: ChartSettings;
    @Output() selectGroup: EventEmitter<string> = new EventEmitter();

    // Now create the chart
    private options = {
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            type: 'pie'
        },
        title: {
            text: ''
        },
        subtitle: {
            text: ''
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            },
            series: {
                events: {
                    click: function () {
                        this.userOptions.selectGroupEmitter.emit(this.chart.hoverPoint.name);
                    }
                }
            }
        },
        series: [{
            name: 'SNMP',
            colorByPoint: true,
            data: [],
            selectGroupEmitter: null
        }]
    };

    ngAfterViewInit() {
        this.options.subtitle.text = this.settings.subtitle;
        this.options.series[0].data = this.set;
        this.options.series[0].selectGroupEmitter = this.selectGroup;
        Highcharts.chart('pie-container-' + this.settings.index, this.options);
    }
}
