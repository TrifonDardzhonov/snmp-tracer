import { Component, Output, EventEmitter } from '@angular/core';
import { SNMPEndpoint } from '../models/snmpEndpoint';
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
        friendlyName: '',
        oid: '',
        host: '',
        port: null,
        community: '',
        supportGrouping: false
    };

    public endpointData: any;

    addEndpoint() {
        this.snmpService.addSNMPEndpoint(this.endpoint).subscribe(success => {
            this.addedSNMPEndpoint.emit(this.endpoint);
        });
    }

    test() {
        this.snmpService.testSNMPEndpoint(this.endpoint).subscribe(endpointData => {
            this.endpointData = endpointData;
        });
    }
}
