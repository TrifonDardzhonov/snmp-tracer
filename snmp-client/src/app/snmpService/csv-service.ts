import { Injectable } from "@angular/core";
import { NodeResponse } from "../models/snmpEndpoint";

@Injectable()
export class CsvService {
    exportResponses(filteredResponses: NodeResponse[]): void {
        const header: string = "Date,Group,Value";
        const csv: string[] = filteredResponses.map(response =>
            `${new Date(Number(response.dateticks)).toString()},${response.group},${response.value}`);
        this.downloadFile([header].concat(...csv).join('\r\n'));
    }

    private downloadFile(content: string): void {
        const a = document.createElement('a');
        const blob = new Blob([content], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);

        a.href = url;
        a.download = 'responses.csv';
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    }
}