import { Component, Output, EventEmitter } from '@angular/core';
import { SNMPEndpoint, GroupMatch, GroupBetween, Status } from '../models/snmpEndpoint';
import { SNMPService } from '../snmpService/snmp-service';

@Component({
    selector: 'app-snmp-endpoint-form',
    templateUrl: './snmp-endpoint-form.component.html',
    styleUrls: ['./snmp-endpoint-form.component.css']
})
export class SNMPEndpointFormComponent {

    @Output() addedSNMPEndpoint = new EventEmitter<SNMPEndpoint>();

    constructor(private snmpService: SNMPService) { }

    public endpoint: SNMPEndpoint = {
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

    public endpointData: any[] = [];
    public loading = false;

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
}
