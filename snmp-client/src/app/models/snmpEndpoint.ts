export interface SNMPEndpoint {
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

export interface GroupMatch {
  id?: number;
  original: string;
  result: string;
  script: string;
  file: File;
}

export interface GroupBetween {
  id?: number;
  from: number;
  to: number;
  result: string;
  script: string;
  file: File;
}

export interface SNMPNode {
  responses: NodeResponse[];
}

export interface NodeResponse {
  id: string;
  oid: string;
  group: string;
  groupId: string;
  value: string;
  dateticks: number;
  scriptOutput: string;
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
  id: number | null = null;
  name: string | null = null;
}
