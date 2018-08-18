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
        return this.http.post<boolean>(this.baseUrl + '/snmpEndpoints/test', endpoint);
    }

    snmpEndPointDetails(endpoint: SNMPEndpoint): Observable<SNMPNode[]> {
        return new Observable<SNMPNode[]>(obs => {
            const data = [
                {
                    type: 'ping',
                    responses: [
                        { value: '300', group: 'slow', dateticks: this.ticks() },
                        { value: '301', group: 'slow', dateticks: this.ticks() + 10000 },
                        { value: '500', group: 'good', dateticks: this.ticks() + 20000 },
                        { value: '200', group: 'slow', dateticks: this.ticks() + 30000 },
                        { value: '30', group: 'slow', dateticks: this.ticks() + 60000 },
                        { value: '300', group: 'slow', dateticks: this.ticks() + 100000 },
                        { value: '301', group: 'slow', dateticks: this.ticks() + 600000 },
                        { value: '500', group: 'good', dateticks: this.ticks() + 700000 },
                        { value: '200', group: 'slow', dateticks: this.ticks() + 800000 },
                        { value: '30', group: 'slow', dateticks: this.ticks() + 900000 }
                    ]
                }
            ];

            obs.next(data);
            obs.complete();
        });
    }

    private ticks() {
        return new Date().getTime();
    }
}
