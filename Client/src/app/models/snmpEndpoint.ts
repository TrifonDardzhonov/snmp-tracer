export class SNMPEndpoint {
  id?: number;
  friendlyName: string;
  description: string;
  oid: string;
  host: string;
  port: number;
  community: string;
  status: Status;
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
  responses: NodeResponse[];
}

export class NodeResponse {
  oid: string;
  group: string;
  value: string;
  dateticks: number;
}

export class Status {
  static Active = {
    id: 1, name: 'Active'
  };
  static Deactivated = {
    id: 2, name: 'Deactivated'
  };
  static Deleted = {
    id: 3, name: 'Deleted'
  };
  id: number;
  name: string;
}
