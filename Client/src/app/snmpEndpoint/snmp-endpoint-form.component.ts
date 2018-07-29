import { Component } from '@angular/core';
import { SNMPEndpoint } from '../models/snmpEndpoint';

@Component({
    selector: 'app-snmp-endpoint-form',
    templateUrl: './snmp-endpoint-form.component.html',
    styleUrls: ['./snmp-endpoint-form.component.css']
})
export class SNMPEndpointFormComponent {
    public endpoint: SNMPEndpoint = {
        friendlyName: '',
        oid: '',
        host: '',
        port: null,
        community: '',
        supportGrouping: false
    };
}
