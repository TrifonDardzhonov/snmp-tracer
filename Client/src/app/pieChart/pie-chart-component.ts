import { Component, AfterViewInit, Input } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ChartSettings } from '../models/chartSettings';

@Component({
    selector: 'app-pie-chart',
    template: `<div [attr.id]="'pie-container-' + settings.index"></div>`
})
export class PieChartComponent implements AfterViewInit {

    @Input() set: any;
    @Input() settings: ChartSettings;

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
            }
        },
        series: [{
            name: 'Brands',
            colorByPoint: true,
            data: []
        }]
    };

    ngAfterViewInit() {
        this.options.title.text = this.settings.title;
        this.options.subtitle.text = this.settings.subtitle;
        this.options.series[0].data = this.set;
        Highcharts.chart('pie-container-' + this.settings.index, this.options);
    }
}
