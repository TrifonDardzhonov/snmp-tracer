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
    this.selectedEndpoint = endpoint;
    if (!this.isMenuOpen) {
      this.isMenuOpen = true;
    }

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

  // on disable grouping -> clean up grouping arrays
  // validations.....
  // on click on pie chart group -> show data in table ->
  // add documentation how to run the project
  // node serve.js -> ng serve --open
  // extracting the csv file -> just an idea
  // remove button for each group
  // remove button for endpoint
  // maybe add description field what this data mean
  // store the correct date for dateticks
}
