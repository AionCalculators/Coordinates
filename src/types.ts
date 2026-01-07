export type Race = 'asmodian' | 'elyos';

export type Skill = 'aethertapping' | 'essencetapping';

export type CoordinateFormat = 'newer' | 'older';

export interface ResourceNode {
  id: string;
  mapKey: string;
  resourceKey: string;
  level: number;
  coordinates: string; // Newer format coordinates
}

export interface MapData {
  mapKey: string;
  resources: ResourceNode[];
}

export interface CoordinateChunk {
  index: number;
  content: string;
}
