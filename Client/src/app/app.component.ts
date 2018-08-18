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
    this.snmpService.snmpEndpoints().subscribe(endpoints => {
      this.endpoints = endpoints;
      this.select(this.endpoints[this.endpoints.length - 1]);
      this.isMenuOpen = false;
    });
  }

  public isMenuOpen = false;
  public nodes: SNMPNode[] = [];
  public loading = false;

  public addedSNMPEndpoint(endpoint: SNMPEndpoint): void {
    this.endpoints.push(endpoint);
    this.select(endpoint);
  }

  public select(endpoint: SNMPEndpoint): void {
    debugger;
    this.selectedEndpoint = endpoint;
    if (!this.isMenuOpen) {
      this.isMenuOpen = true;
    }

    this.loading = true;
    this.snmpService.snmpEndPointDetails({
      friendlyName: '',
      oid: '1, 3, 6, 1, 2, 1, 1',
      host: 'demo.snmplabs.com',
      port: 161,
      community: 'public',
      supportGrouping: false
    }).subscribe(n => {
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

  // add checkbox for "Support grouping"
  // add key value pairs -> value between -> GROUP
}
