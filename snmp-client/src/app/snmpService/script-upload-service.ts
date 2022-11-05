import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable()
export class ScriptUploadService {

    constructor(private http: HttpClient) {
    }

    uploadAndAssign(
        endpointId: number,
        files: { file: File | undefined }[],
        groups: { id?: number, script: string }[]): { endpointId: number, groupId: number, script: string }[] {
        const scripts: { endpointId: number, groupId: number, script: string }[] = [];
        groups.forEach((group, index) => {
            const file = files[index].file;
            if (!!file) {
                // Populate the script info
                scripts.push({
                    endpointId: endpointId as number,
                    groupId: group.id as number,
                    script: this.buildScriptName(endpointId as number, group.id as number, file)
                });

                // Upload the file
                this.upload(
                    endpointId as number,
                    group.id as number,
                    file)
                    .subscribe((script) => group.script = script);
            }
        });
        return scripts;
    }

    originalScriptName(endpointId: number, groupId: number, script: string): string {
        const prefix: string = this.scriptPrefix(endpointId, groupId);
        return script.slice(script.indexOf(prefix) + prefix.length);
    }

    private upload(endpointId: number, groupId: number, file: File | null): Observable<string> {
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

    private buildScriptName(endpointId: number, groupId: number, file: File | null): string {
        return `${this.scriptPrefix(endpointId, groupId)}${file?.name}`;
    }

    private scriptPrefix(endpointId: number, groupId: number): string {
        return `${endpointId}_${groupId}_`;
    }

    private renameFile(originalFile: File, newName: string) {
        return new File([originalFile], newName, {
            type: originalFile.type,
            lastModified: originalFile.lastModified,
        });
    }

    private get baseUrl(): string {
        return 'http://localhost:3000/';
    }
}