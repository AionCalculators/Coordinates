import { Race, Skill, ResourceNode } from '../types';
import { aethertappingAsmodian } from './aethertapping-asmodian';
import { aethertappingElyos } from './aethertapping-elyos';
import { essencetappingAsmodian } from './essencetapping-asmodian';
import { essencetappingElyos } from './essencetapping-elyos';

export function getCoordinates(race: Race, skill: Skill): ResourceNode[] {
  if (race === 'asmodian') {
    return skill === 'aethertapping' ? aethertappingAsmodian : essencetappingAsmodian;
  } else {
    return skill === 'aethertapping' ? aethertappingElyos : essencetappingElyos;
  }
}

export function filterByLevel(nodes: ResourceNode[], skillLevel: number | null): ResourceNode[] {
  if (skillLevel === null) {
    return nodes;
  }
  // Filter out resources more than 40 levels below the player's skill level
  const minLevel = Math.max(1, skillLevel - 40);
  return nodes.filter(node => node.level >= minLevel && node.level <= skillLevel + 10);
}

export function groupByMap(nodes: ResourceNode[]): Map<string, ResourceNode[]> {
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
  
  return grouped;
}

export function getUniqueMaps(nodes: ResourceNode[]): string[] {
  const maps = new Set<string>();
  for (const node of nodes) {
    maps.add(node.mapKey);
  }
  return Array.from(maps);
}
