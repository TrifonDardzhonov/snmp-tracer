export class SNMPEndpoint {
    friendlyName: string;
    oid: string;
    host: string;
    port: number;
    community: string;
    supportGrouping: boolean;
    groupingMatch: GroupMatch[];
    groupingBetween: GroupBetween[];
}

export class GroupMatch {
    original: string;
    result: string;
}

export class GroupBetween {
    from: number;
    to: number;
    result: string;
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
