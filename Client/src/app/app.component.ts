import { Component } from '@angular/core';
import { ChartSettings } from './models/chartSettings';
import { SNMPService } from './snmpService/snmp-service';
import { SNMPEndpoint, SNMPNode, NodeResponse } from './models/snmpEndpoint';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private endpoints: SNMPEndpoint[] = [];
  public selectedEndpoint: SNMPEndpoint;

  constructor(private snmpService: SNMPService) {
    this.snmpService.snmpEndpoints().subscribe(endpoints => this.endpoints = endpoints);
  }

  public isMenuOpen = false;

  // Data generated from http://www.bikeforums.net/professional-cycling-fans/1113087-2017-tour-de-france-gpx-tcx-files.html
  public lineChartData = [
    [0.0, 225],
    [0.1, 226],
    [0.2, 228],
    [0.3, 228],
    [0.4, 229],
    [0.5, 229],
    [0.6, 230],
    [0.7, 234],
    [0.8, 235],
    [0.9, 236],
    [1.0, 235],
    [1.1, 232],
    [1.2, 228],
    [1.3, 223],
    [1.4, 218],
    [1.5, 214],
    [1.6, 207],
    [1.7, 202],
    [1.8, 198],
    [1.9, 196],
  ];

  public pieChartData = [{
    name: 'Chrome',
    y: 61.41,
  }, {
    name: 'Internet Explorer',
    y: 11.84
  }, {
    name: 'Firefox',
    y: 10.85
  }, {
    name: 'Edge',
    y: 4.67
  }, {
    name: 'Safari',
    y: 4.18
  }, {
    name: 'Sogou Explorer',
    y: 1.64
  }, {
    name: 'Opera',
    y: 1.6
  }, {
    name: 'QQ',
    y: 1.2
  }, {
    name: 'Other',
    y: 2.61
  }];

  public nodes: SNMPNode[] = [];
  public loading = false;

  public select(endpoint: SNMPEndpoint): void {
    this.selectedEndpoint = endpoint;

    this.loading = true;
    this.snmpService.snmpEndPointDetails(endpoint).subscribe(n => {
      this.nodes = n;
      this.loading = false;
    });
  }

  public mapToPieChart(responses: NodeResponse[]) {
    const pie = {};
    responses.forEach((r) => {
      if (!pie[r.group]) {
        pie[r.group] = 0;
      }

      pie[r.group]++;
    });

    const pieData = [];
    for (const sl in pie) {
      if (pie[sl]) {
        pieData.push({
          name: sl,
          y: (pie[sl] / responses.length) * 100
        });
      }
    }

    return pieData;
  }

  public mapPieSettings(node: SNMPNode, index: number): ChartSettings {
    return {
      index: index,
      title: node.type,
      subtitle: 'Grouped by slices'
    };
  }

  public mapToLineChart(responses: NodeResponse[]) {
    return responses.map((r) => {
      return [new Date(r.dateticks), parseInt(r.value, 0)];
    });
  }

  public mapLineSettings(node: SNMPNode, index: number): ChartSettings {
    return {
      index: index,
      title: node.type,
      subtitle: 'Details by date'
    };
  }
}
