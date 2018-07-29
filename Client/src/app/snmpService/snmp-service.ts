import { Injectable } from '../../../node_modules/@angular/core';
import { SNMPEndpoint, SNMPNode } from '../models/snmpEndpoint';
import { Observable } from '../../../node_modules/rxjs/Observable';

@Injectable()
export class SNMPService {
    snmpEndpoints(): Observable<SNMPEndpoint[]> {
        return new Observable<SNMPEndpoint[]>(obs => {
            obs.next([{
                'friendlyName': 'Ping',
                'oid': '1, 3, 6, 1, 2, 1, 1, 3, 0',
                'host': 'demo.snmplabs.com',
                'port': 161,
                'community': 'public'
            }, {
                'friendlyName': 'Ping 2',
                'oid': '1, 3, 6, 1, 2, 1, 1',
                'host': 'demo.snmplabs.com',
                'port': 161,
                'community': 'public'
            }]);
            obs.complete();
        });
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
                },
                {
                    type: 'bandwith',
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
                },
            ];

            obs.next(data);
            obs.complete();
        });
    }

    private ticks() {
        return new Date().getTime();
    }
}
