import {Injectable} from '@angular/core';
import {SNMPEndpoint, SNMPNode, Status} from '../models/snmpEndpoint';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SNMPService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {
  }

  snmpEndpoints(): Observable<SNMPEndpoint[]> {
    return this.http.get<SNMPEndpoint[]>(this.baseUrl + '/snmpEndpoints');
  }

  addSNMPEndpoint(endpoint: SNMPEndpoint): Observable<SNMPEndpoint> {
    return this.http.post<SNMPEndpoint>(this.baseUrl + '/snmpEndpoints', endpoint);
  }

  testSNMPEndpoint(endpoint: SNMPEndpoint): Observable<any> {
    return this.http.post<any>(this.baseUrl + '/snmpEndpoints/test', endpoint);
  }

  snmpEndPointDetails(endpoint: SNMPEndpoint, startDate: string, endDate: string): Observable<SNMPNode> {
    return this.http.post<SNMPNode>(this.baseUrl + '/snmpEndpoint/data', {
      endpoint: endpoint, startDate: startDate, endDate: endDate
    });
  }

  setStatus(endpoint: SNMPEndpoint, status: Status): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl + '/snmpEndpoint/setStatus', {
      endpoint: endpoint, status: status
    });
  }
}
