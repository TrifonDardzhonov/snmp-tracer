export class SNMPEndpoint {
    friendlyName: string;
    oid: string;
    host: string;
    port: number;
    community: string;
    supportGrouping: boolean;
}

export class SNMPNode {
    type: string;
    responses: NodeResponse[];
}

export class NodeResponse {
    group: string;
    value: string;
    dateticks: number;
}
