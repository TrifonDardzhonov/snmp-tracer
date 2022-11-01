import {ChangeDetectionStrategy, ChangeDetectorRef, Component} from '@angular/core';
import {ChartSettings} from './models/chartSettings';
import {SNMPService} from './snmpService/snmp-service';
import {NodeResponse, SNMPEndpoint, SNMPNode, Status} from './models/snmpEndpoint';
import {CsvService} from './snmpService/csv-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {

  public Status: typeof Status = Status;
  public loading: boolean = false;

  public selectedEndpoint: SNMPEndpoint | undefined;
  public selectedEndpointNode: SNMPNode | undefined;
  public filteredResponses: NodeResponse[] = [];

  public endpoints: SNMPEndpoint[] = [];
  public isMenuOpen: boolean = true;

  public startDate: Date | undefined;
  public startDateRequested: Date | undefined;
  public endDate: Date | undefined;
  public endDateRequested: Date | undefined;

  constructor(
    private snmpService: SNMPService, 
    private csvService: CsvService,
    private changeDetectorRef: ChangeDetectorRef) {
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
    if (endpoint.status.id !== Status.Deleted.id) {
      endpoint.showStatuses = !endpoint.showStatuses;
    }
  }

  public showStatuses(endpoint: any): boolean {
    return endpoint.showStatuses === true;
  }

  public mapToPieChart(responses: NodeResponse[]): any[] {
    const pie: any = {};
    responses.forEach((r: NodeResponse) => {
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
      subtitle: `SNMP responses (${new Date(this.startDateRequested as Date).toLocaleString()} - ${new Date(this.endDateRequested as Date).toLocaleString()})`
    };
  }

  public selectGroup(group?: string): void {
    this.filteredResponses = this.selectedEndpointNode?.responses.filter(response => {
      return !group || response.group === group;
    }).sort((a, b) => b.dateticks - a.dateticks) || [];
  }

  public removeEndDate() {
    this.endDate = undefined;
  }

  public hasScript(groupId: string | undefined): boolean {
    return this.endpoints.some(endpoint =>
      endpoint.groupingBetween?.some(group => group.id == groupId && group.script.length > 0) ||
      endpoint.groupingMatch?.some(group => group.id == groupId && group.script.length > 0)
    );
  }

  public viewScriptOutput(response: NodeResponse): void {
    this.snmpService.scriptsOutputs(null, null, response.id).subscribe(scriptsOutputs => {
      response.scriptOutput = scriptsOutputs.outputs[0].text;
      this.changeDetectorRef.detectChanges();
    });
  }

  private initDateRangeState() {
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 1);
  }

  private reloadEndpointDetails(): void {
    if (!this.selectedEndpoint) {
      return;
    }

    this.loading = true;
    this.startDateRequested = this.startDate;
    this.endDateRequested = this.endDate || new Date();
    this.snmpService.snmpEndPointResponses(this.selectedEndpoint as SNMPEndpoint, (this.startDate as Date).toISOString(), this.endDateAsIso()).subscribe(node => {
      this.selectedEndpointNode = node;
      this.loading = false;
      this.changeDetectorRef.detectChanges();
    });
  }

  private endDateAsIso() {
    return this.endDate ? this.endDate.toISOString() : (new Date()).toISOString();
  }

  public downloadAsCsv(): void {
    this.csvService.exportResponses(this.filteredResponses);
  }
}
