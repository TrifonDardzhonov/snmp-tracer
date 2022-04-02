import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {ChartSettings} from './models/chartSettings';
import {SNMPService} from './snmpService/snmp-service';
import {NodeResponse, SNMPEndpoint, SNMPNode, Status} from './models/snmpEndpoint';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  public selectedEndpoint: SNMPEndpoint;
  public isMenuOpen = true;
  public startDate: Date;
  public endDate: Date;
  public nodes: SNMPNode[] = [];
  public responsesForDetailReview: NodeResponse[] = [];
  public loading = false;
  public status = Status;
  public endpoints: SNMPEndpoint[] = [];

  constructor(private snmpService: SNMPService, private changeDetectorRef: ChangeDetectorRef) {
    this.initDateRangeState();
    this.snmpService.snmpEndpoints().subscribe(endpoints => {
      this.endpoints = endpoints;
      this.select(this.endpoints[this.endpoints.length - 1]);
      this.isMenuOpen = true;
    });
  }

  public addedSNMPEndpoint(endpoint: SNMPEndpoint): void {
    this.endpoints.push(endpoint);
    this.select(endpoint);
  }

  public select(endpoint: SNMPEndpoint): void {
    this.selectedEndpoint = endpoint;
    this.responsesForDetailReview.length = 0;
    if (!this.isMenuOpen) {
      this.isMenuOpen = true;
    }
    this.reloadEndpointData();
  }

  public dateRangeIsModified() {
    this.reloadEndpointData();
  }

  public refresh() {
    this.reloadEndpointData();
  }

  public toggleShowStatuses(endpoint: any): void {
    endpoint.showStatuses = !endpoint.showStatuses;
  }

  public showStatuses(endpoint: any): boolean {
    return endpoint.showStatuses === true;
  }

  public setStatus(endpoint: any, status: Status): void {
    this.snmpService.setStatus(endpoint, status).subscribe((success) => {
      if (success) {
        endpoint.status = status;
      }
      endpoint.showStatuses = false;
      this.changeDetectorRef.detectChanges();
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
          name: sl, y: (pie[sl] / responses.length) * 100
        });
      }
    }

    return pieData;
  }

  public mapPieSettings(node: SNMPNode, index: number): ChartSettings {
    return {
      index: index, subtitle: 'Grouped by slices'
    };
  }

  public selectGroup(group: string): void {
    this.responsesForDetailReview = this.nodes[0].responses.filter(response => {
      return response.group === group;
    });
  }

  public mapToLineChart(responses: NodeResponse[]) {
    return responses.map((r) => {
      return [new Date(r.dateticks), parseInt(r.value, 0)];
    });
  }

  public mapLineSettings(node: SNMPNode, index: number): ChartSettings {
    return {
      index: index, subtitle: 'Details by date'
    };
  }

  public removeEndDate() {
    this.endDate = null;
  }

  private initDateRangeState() {
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 1);
  }

  private reloadEndpointData(): void {
    this.loading = true;
    this.snmpService.snmpEndPointDetails(this.selectedEndpoint, this.startDate.toISOString(), this.endDateAsIso()).subscribe(nodes => {
      this.nodes = nodes;
      this.loading = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  private endDateAsIso() {
    return this.endDate ? this.endDate.toISOString() : (new Date()).toISOString();
  }
}
