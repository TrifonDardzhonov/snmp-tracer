import { Component, EventEmitter, Output } from '@angular/core';
import { GroupBetween, GroupMatch, SNMPEndpoint, Status } from '../models/snmpEndpoint';
import { ScriptUploadService } from '../snmpService/script-upload-service';
import { SNMPService } from '../snmpService/snmp-service';

@Component({
  selector: 'app-snmp-endpoint-form',
  templateUrl: './snmp-endpoint-form.component.html',
  styleUrls: ['./snmp-endpoint-form.component.css']
})
export class SNMPEndpointFormComponent {

  @Output() addedSNMPEndpoint = new EventEmitter<SNMPEndpoint>();
  public endpoint: SNMPEndpoint = SNMPEndpointFormComponent.emptyEndpoint();
  public endpointData: any[] = [];
  public loading = false;

  constructor(private snmpService: SNMPService, private scriptUploadService: ScriptUploadService) { }

  toggleGrouping() {
    this.endpoint.supportGrouping = !this.endpoint?.supportGrouping;
    this.endpoint.groupingMatch.length = 0;
    this.endpoint.groupingBetween.length = 0;
  }

  addMatchingGroup() {
    this.endpoint.groupingMatch.push({} as GroupMatch);
  }

  removeMatchingGroup(index: number) {
    this.endpoint.groupingMatch.splice(index, 1);
  }

  addBetweenGroup() {
    this.endpoint.groupingBetween.push({} as GroupBetween);
  }

  removeBetweenGroup(index: number) {
    this.endpoint.groupingBetween.splice(index, 1);
  }

  addEndpoint() {
    this.snmpService.addSNMPEndpoint(this.endpoint).subscribe(endpoint => {
      const scripts: { endpointId: number, groupId: number, script: string }[] = [];

      scripts.push(...this.scriptUploadService.uploadAndAssign(
        endpoint.id as number,
        this.endpoint.groupingBetween,
        endpoint.groupingBetween));
      scripts.push(...this.scriptUploadService.uploadAndAssign(
        endpoint.id as number,
        this.endpoint.groupingMatch,
        endpoint.groupingMatch));

      this.snmpService.updateGroupScript(scripts).subscribe(() => {
        this.addedSNMPEndpoint.emit(endpoint);
        this.endpoint = SNMPEndpointFormComponent.emptyEndpoint();
      });
    });
  }

  test() {
    this.endpointData.length = 0;
    this.loading = true;
    this.snmpService.testSNMPEndpoint(this.endpoint).subscribe(endpointData => {
      this.endpointData = endpointData;
      this.loading = false;
    });
  }

  selectFile(group: any, target: any): void {
    group.file = target.files[0];
  }

  static emptyEndpoint() {
    return {
      id: undefined,
      friendlyName: '',
      description: '',
      oid: '',
      host: '',
      port: 0,
      community: '',
      status: Status.Active,
      supportGrouping: false,
      groupingMatch: [],
      groupingBetween: []
    };
  }
}
