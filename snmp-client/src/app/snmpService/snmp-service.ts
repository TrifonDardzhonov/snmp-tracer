import {Injectable} from '@angular/core';
import {SNMPEndpoint, SNMPNode, Status} from '../models/snmpEndpoint';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SNMPService {

  constructor(private http: HttpClient) {
  }

  snmpEndpoints(): Observable<SNMPEndpoint[]> {
    return this.http.get<SNMPEndpoint[]>(this.baseUrl + 'snmpEndpoints');
  }

  addSNMPEndpoint(endpoint: SNMPEndpoint): Observable<SNMPEndpoint> {
    return this.http.post<SNMPEndpoint>(this.baseUrl + 'snmpEndpoints', endpoint);
  }

  testSNMPEndpoint(endpoint: SNMPEndpoint): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'snmpEndpoints/test', endpoint);
  }

  snmpEndPointResponses(endpoint: SNMPEndpoint, startDate: string, endDate: string): Observable<SNMPNode> {
    return this.http.post<SNMPNode>(this.baseUrl + 'snmpEndpoint/responses', {
      endpoint: endpoint, startDate: startDate, endDate: endDate
    });
  }

  setStatus(endpoint: SNMPEndpoint, status: Status): Observable<boolean> {
    return this.http.post<boolean>(this.baseUrl + 'snmpEndpoint/setStatus', {
      endpoint: endpoint,
      status: status
    });
  }

  scriptsOutputs(endpointId: number | null, groupId: number | null, snmpResponseId: string | null): Observable<any> {
    return this.http.post<any>(this.baseUrl + 'scriptsOutputs', {
      endpointId: endpointId,
      groupId: groupId,
      snmpResponseId: snmpResponseId,
    });
  }

  buildScriptName(endpointId: number, groupId: number, file: File | null): string {
    return `${endpointId}_${groupId}_${file?.name}`;
  }

  upload(endpointId: number, groupId: number, file: File | null): Observable<string> {
    if (!file) {
      throw new Error("File is missing!");
    }

    file = this.renameFile(file, this.buildScriptName(endpointId, groupId, file));

    const formData: FormData = new FormData();
    formData.append('file', file);

    return new Observable(subs => {
      this.http.post<string>(this.baseUrl + 'snmpEndpoint/upload', formData)
        .subscribe(() => {
          subs.next(file?.name);
          subs.complete();
        });
    });
  }

  updateGroupScript(scripts: {endpointId: number, groupId: number, script: string}[]): Observable<void> {
    return new Observable<void>(subs => {
      this.http.post<any>(this.baseUrl + 'snmpEndpoint/updateGroupScript', scripts)
        .subscribe(() => {
          subs.next();
          subs.complete;
        });
    });
  }

  renameFile(originalFile: File, newName: string) {
    return new File([originalFile], newName, {
        type: originalFile.type,
        lastModified: originalFile.lastModified,
    });
}

  private get baseUrl(): string {
    return 'http://localhost:3000/';
  }
}
