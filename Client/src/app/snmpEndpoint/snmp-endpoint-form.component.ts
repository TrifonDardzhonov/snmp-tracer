import {Component, EventEmitter, Output} from '@angular/core';
import {GroupBetween, GroupMatch, SNMPEndpoint, Status} from '../models/snmpEndpoint';
import {SNMPService} from '../snmpService/snmp-service';

@Component({
  selector: 'app-snmp-endpoint-form',
  templateUrl: './snmp-endpoint-form.component.html',
  styleUrls: ['./snmp-endpoint-form.component.css']
})
export class SNMPEndpointFormComponent {

  @Output() addedSNMPEndpoint = new EventEmitter<SNMPEndpoint>();
  public endpoint: SNMPEndpoint;
  public endpointData: any[] = [];
  public loading = false;

  constructor(private snmpService: SNMPService) {
    this.reset();
  }

  toggleGrouping() {
    this.endpoint.supportGrouping = !this.endpoint.supportGrouping;
    this.endpoint.groupingMatch.length = 0;
    this.endpoint.groupingBetween.length = 0;
  }

  addMatchingGroup() {
    this.endpoint.groupingMatch.push(new GroupMatch());
  }

  removeMatchingGroup(index: number) {
    this.endpoint.groupingMatch.splice(index, 1);
  }

  addBetweenGroup() {
    this.endpoint.groupingBetween.push(new GroupBetween());
  }

  removeBetweenGroup(index: number) {
    this.endpoint.groupingBetween.splice(index, 1);
  }

  addEndpoint() {
    this.snmpService.addSNMPEndpoint(this.endpoint).subscribe(endpoint => {
      this.addedSNMPEndpoint.emit(endpoint);
      this.reset();
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

  private reset() {
    this.endpoint = {
      id: null,
      friendlyName: '',
      description: '',
      oid: '',
      host: '',
      port: null,
      community: '',
      status: Status.Active,
      supportGrouping: false,
      groupingMatch: [],
      groupingBetween: []
    };
  }
}
