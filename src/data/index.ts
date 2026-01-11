import { Race, Skill, ResourceNode } from '../types';
import { aethertappingAsmodian } from './aethertapping-asmodian';
import { aethertappingElyos } from './aethertapping-elyos';
import { aethertappingReshanta } from './aethertapping-reshanta';
import { essencetappingAsmodian } from './essencetapping-asmodian';
import { essencetappingElyos } from './essencetapping-elyos';
import { essencetappingReshanta } from './essencetapping-reshanta';

export function getCoordinates(race: Race, skill: Skill): ResourceNode[] {
  if (race === 'asmodian') {
    const raceData = skill === 'aethertapping' ? aethertappingAsmodian : essencetappingAsmodian;
    const reshantaData = skill === 'aethertapping' ? aethertappingReshanta : essencetappingReshanta;
    return [...raceData, ...reshantaData];
  } else {
    const raceData = skill === 'aethertapping' ? aethertappingElyos : essencetappingElyos;
    const reshantaData = skill === 'aethertapping' ? aethertappingReshanta : essencetappingReshanta;
    return [...raceData, ...reshantaData];
  }
}

export function filterByLevel(nodes: ResourceNode[], skillLevel: number | null): ResourceNode[] {
  if (skillLevel === null) {
    return nodes;
  }
  // Filter out resources more than 40 levels below the player's skill level
  const minLevel = Math.max(1, skillLevel - 40);
  return nodes.filter(node => node.level >= minLevel && node.level <= skillLevel);
}

// Define map order for each race
const ELYOS_MAP_ORDER = [
  'poeta',
  'verteron',
  'eltnen',
  'heiron',
  'theobomos',
  'lower_reshanta',
  'upper_reshanta',
];

const ASMODIAN_MAP_ORDER = [
  'ishalgen',
  'altgard',
  'morheim',
  'beluslan',
  'brusthonin',
  'lower_reshanta',
  'upper_reshanta',
];

export function groupByMap(nodes: ResourceNode[], race: Race): Map<string, ResourceNode[]> {
  const grouped = new Map<string, ResourceNode[]>();
  
  for (const node of nodes) {
    const existing = grouped.get(node.mapKey) || [];
    existing.push(node);
    grouped.set(node.mapKey, existing);
  }
  
  // Sort each group by level
  for (const [key, value] of grouped) {
    grouped.set(key, value.sort((a, b) => a.level - b.level));
  }
  
  // Get the appropriate map order based on race
  const mapOrder = race === 'elyos' ? ELYOS_MAP_ORDER : ASMODIAN_MAP_ORDER;
  
  // Create a new map with the correct order
  const orderedGrouped = new Map<string, ResourceNode[]>();
  
  // First add maps in the defined order
  for (const mapKey of mapOrder) {
    if (grouped.has(mapKey)) {
      orderedGrouped.set(mapKey, grouped.get(mapKey)!);
    }
  }
  
  // Then add any remaining maps that weren't in the predefined order
  for (const [mapKey, resources] of grouped) {
    if (!orderedGrouped.has(mapKey)) {
      orderedGrouped.set(mapKey, resources);
    }
  }
  
  return orderedGrouped;
}

export function getUniqueMaps(nodes: ResourceNode[], race: Race): string[] {
  const maps = new Set<string>();
  for (const node of nodes) {
    maps.add(node.mapKey);
  }
  
  // Get the appropriate map order based on race
  const mapOrder = race === 'elyos' ? ELYOS_MAP_ORDER : ASMODIAN_MAP_ORDER;
  
  // Sort maps according to the predefined order
  const orderedMaps: string[] = [];
  
  // First add maps in the defined order
  for (const mapKey of mapOrder) {
    if (maps.has(mapKey)) {
      orderedMaps.push(mapKey);
    }
  }
  
  // Then add any remaining maps that weren't in the predefined order
  for (const mapKey of maps) {
    if (!orderedMaps.includes(mapKey)) {
      orderedMaps.push(mapKey);
    }
  }
  
  return orderedMaps;
}
