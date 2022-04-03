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

  public Status: typeof Status = Status;
  public loading: boolean = false;

  public selectedEndpoint: SNMPEndpoint;
  public selectedEndpointNode: SNMPNode;
  public filteredResponses: NodeResponse[] = [];

  public endpoints: SNMPEndpoint[] = [];
  public isMenuOpen: boolean = true;

  public startDate: Date;
  public startDateRequested: Date;
  public endDate: Date;
  public endDateRequested: Date;

  constructor(private snmpService: SNMPService, private changeDetectorRef: ChangeDetectorRef) {
    this.initDateRangeState();
    this.snmpService.snmpEndpoints().subscribe(endpoints => {
      this.endpoints = endpoints;
      this.select(this.endpoints[this.endpoints.length - 1]);
      this.isMenuOpen = true;
    });
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

  public addedSNMPEndpoint(endpoint: SNMPEndpoint): void {
    this.endpoints.push(endpoint);
    this.select(endpoint);
  }

  public select(endpoint: SNMPEndpoint): void {
    this.selectedEndpoint = endpoint;
    this.filteredResponses.length = 0;
    if (!this.isMenuOpen) {
      this.isMenuOpen = true;
    }
    this.reloadEndpointDetails();
  }

  public refresh(): void {
    this.reloadEndpointDetails();
  }

  public toggleShowStatuses(endpoint: any): void {
    endpoint.showStatuses = !endpoint.showStatuses;
  }

  public showStatuses(endpoint: any): boolean {
    return endpoint.showStatuses === true;
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
      index: index,
      subtitle: `SNMP responses (${new Date(this.startDateRequested).toLocaleString()} - ${new Date(this.endDateRequested).toLocaleString()})`
    };
  }

  public selectGroup(group?: string): void {
    this.filteredResponses = this.selectedEndpointNode.responses.filter(response => {
      return !group || response.group === group;
    }).sort((a, b) => b.dateticks - a.dateticks);
  }

  public removeEndDate() {
    this.endDate = null;
  }

  private initDateRangeState() {
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 1);
  }

  private reloadEndpointDetails(): void {
    this.loading = true;
    this.startDateRequested = this.startDate;
    this.endDateRequested = this.endDate || new Date();
    this.snmpService.snmpEndPointDetails(this.selectedEndpoint, this.startDate.toISOString(), this.endDateAsIso()).subscribe(node => {
      this.selectedEndpointNode = node;
      this.loading = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  private endDateAsIso() {
    return this.endDate ? this.endDate.toISOString() : (new Date()).toISOString();
  }
}
