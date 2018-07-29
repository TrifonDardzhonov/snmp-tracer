import { Injectable } from '../../../node_modules/@angular/core';
import { SNMPEndpoint } from '../models/snmpEndpoint';
import { Observable } from '../../../node_modules/rxjs/Observable';

@Injectable()
export class SNMPService {
    snmpEndpoints(): Observable<SNMPEndpoint[]> {
        return new Observable<SNMPEndpoint[]>(obs => {
            obs.next([{
                'oid': '1, 3, 6, 1, 2, 1, 1, 3, 0',
                'host': 'demo.snmplabs.com',
                'port': 161,
                'community': 'public'
              }, {
                'oid': '1, 3, 6, 1, 2, 1, 1',
                'host': 'demo.snmplabs.com',
                'port': 161,
                'community': 'public'
              }]);
            obs.complete();
        });
    }

    snmpEndPointDetails() {

    }
}
