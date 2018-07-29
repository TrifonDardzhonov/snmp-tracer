export class SNMPEndpoint {
    oid: string;
    host: string;
    port: number;
    community: string;
}

export class SNMPNode {
    type: string;
    responses: NodeResponse[];
}

export class NodeResponse {
    value: string;
    dateticks: number;
}
