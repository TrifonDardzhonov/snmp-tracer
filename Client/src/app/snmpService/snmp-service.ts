import { Injectable } from '../../../node_modules/@angular/core';
import { SNMPEndpoint, SNMPNode } from '../models/snmpEndpoint';
import { Observable } from '../../../node_modules/rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class SNMPService {

    private baseUrl = 'http://localhost:3000';

    constructor(private http: HttpClient) { }

    snmpEndpoints(): Observable<SNMPEndpoint[]> {
        return this.http.get<SNMPEndpoint[]>(this.baseUrl + '/snmpEndpoints');
    }

    addSNMPEndpoint(endpoint: SNMPEndpoint): Observable<boolean> {
        return this.http.post<boolean>(this.baseUrl + '/snmpEndpoints', endpoint);
    }

    testSNMPEndpoint(endpoint: SNMPEndpoint): Observable<any> {
        return this.http.post<any>(this.baseUrl + '/snmpEndpoints/test', endpoint);
    }

    snmpEndPointDetails(endpoint: SNMPEndpoint): Observable<SNMPNode[]> {
        return this.http.post<SNMPNode[]>(this.baseUrl + '/snmpEndpoint/data', endpoint);
    }
}
