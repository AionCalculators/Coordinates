// Script to convert Aion-map gathering data to our format
const fs = require('fs');
const path = require('path');

// Source directory with JSON files
const sourceDir = path.join(__dirname, '..', 'Aion-map-source', 'public', 'data', 'gathering');

// Location to race mapping
const asmodianMaps = ['ishalgen', 'altgard', 'morheim', 'beluslan', 'brusthonin'];
const elyosMaps = ['poeta', 'verteron', 'eltnen', 'heiron', 'theobomos'];
const reshantaMaps = ['lower', 'upper']; // Reshanta - separate files for both races

// Map file names to proper mapKey names
const mapKeyMapping = {
  'lower': 'lower_reshanta',
  'upper': 'upper_reshanta'
};

// Aethertapping gathering type
const aetherType = 'Aether';

// Function to parse ingame_coords string and extract individual coordinates
function parseIngameCoords(ingameCoordsStr, resourceName, ruName, level) {
  if (!ingameCoordsStr) return [];
  
  const coordPattern = /\[pos:([^;]+);\s*(\d+)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+(\d+)\]/g;
  const coords = [];
  const seenCoords = new Set();
  
  let match;
  while ((match = coordPattern.exec(ingameCoordsStr)) !== null) {
    const mapId = match[2];
    const x = parseFloat(match[3]);
    const y = parseFloat(match[4]);
    const z = parseFloat(match[5]);
    
    // Create a unique key to avoid duplicates
    const key = `${mapId}-${x.toFixed(1)}-${y.toFixed(1)}-${z.toFixed(1)}`;
    if (seenCoords.has(key)) continue;
    seenCoords.add(key);
    
    // Build coordinate string in the format used by the game
    // Format: [pos:resourceName;mapId x y z 0]
    const coordStr = `[pos:${ruName};${mapId} ${x} ${y} ${z} 0]`;
    
    coords.push({
      level: level,
      coordinates: coordStr
    });
  }
  
  return coords;
}

// Function to convert resource name to a valid key (for resourceKey)
function toResourceKey(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-zа-яё0-9_]/gi, '');
}

// Process all files
function processFiles() {
  const essencetappingAsmodian = [];
  const essencetappingElyos = [];
  const essencetappingReshanta = [];
  const aethertappingAsmodian = [];
  const aethertappingElyos = [];
  const aethertappingReshanta = [];
  
  const allFiles = fs.readdirSync(sourceDir).filter(f => f.endsWith('.json'));
  
  for (const file of allFiles) {
    const mapKey = path.basename(file, '.json');
    const filePath = path.join(sourceDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Determine which category this map belongs to
    const isAsmodian = asmodianMaps.includes(mapKey);
    const isElyos = elyosMaps.includes(mapKey);
    const isReshanta = reshantaMaps.includes(mapKey);
    
    if (!isAsmodian && !isElyos && !isReshanta) {
      console.log(`Skipping unknown map: ${mapKey}`);
      continue;
    }
    
    console.log(`Processing ${mapKey}...`);
    
    for (const resource of data) {
      const isAether = resource.gathering_type === aetherType;
      const coords = parseIngameCoords(
        resource.ingame_coords,
        resource.name,
        resource.ru_name,
        resource.gathering_lvl
      );
      
      if (coords.length === 0) continue;
      
      const resourceKey = toResourceKey(resource.ru_name);
      
      for (const coord of coords) {
        const node = {
          mapKey: mapKeyMapping[mapKey] || mapKey,
          resourceKey: resourceKey,
          level: coord.level,
          coordinates: coord.coordinates
        };
        
        if (isAether) {
          if (isAsmodian) aethertappingAsmodian.push(node);
          else if (isElyos) aethertappingElyos.push(node);
          else if (isReshanta) aethertappingReshanta.push(node);
        } else {
          if (isAsmodian) essencetappingAsmodian.push(node);
          else if (isElyos) essencetappingElyos.push(node);
          else if (isReshanta) essencetappingReshanta.push(node);
        }
      }
    }
  }
  
  return {
    essencetappingAsmodian,
    essencetappingElyos,
    essencetappingReshanta,
    aethertappingAsmodian,
    aethertappingElyos,
    aethertappingReshanta
  };
}

// Function to generate TypeScript file content
function generateTsFile(nodes, variableName, skillName, category) {
  // Sort nodes by mapKey, then by level, then by resourceKey
  nodes.sort((a, b) => {
    if (a.mapKey !== b.mapKey) return a.mapKey.localeCompare(b.mapKey);
    if (a.level !== b.level) return a.level - b.level;
    return a.resourceKey.localeCompare(b.resourceKey);
  });
  
  // Generate unique IDs
  const prefix = skillName === 'aethertapping' ? 'aeth' : 'ess';
  let idPrefix;
  if (category === 'asmodian') idPrefix = 'asm';
  else if (category === 'elyos') idPrefix = 'ely';
  else idPrefix = 'resh';
  
  // Category display name
  let categoryDisplay;
  if (category === 'asmodian') categoryDisplay = 'Asmodians';
  else if (category === 'elyos') categoryDisplay = 'Elyos';
  else categoryDisplay = 'Reshanta (both races)';
  
  const lines = [];
  lines.push(`import { ResourceNode } from '../types';`);
  lines.push(``);
  lines.push(`// ${skillName.charAt(0).toUpperCase() + skillName.slice(1)} coordinates for ${categoryDisplay}`);
  lines.push(`// Source: https://github.com/Persepha/Aion-map`);
  lines.push(`// Total: ${nodes.length} coordinates`);
  lines.push(`export const ${variableName}: ResourceNode[] = [`);
  
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const id = `${prefix}-${idPrefix}-${i + 1}`;
    const comma = i < nodes.length - 1 ? ',' : '';
    lines.push(`  { id: '${id}', mapKey: '${node.mapKey}', resourceKey: '${node.resourceKey}', level: ${node.level}, coordinates: '${node.coordinates}' }${comma}`);
  }
  
  lines.push(`];`);
  lines.push(``);
  
  return lines.join('\n');
}

// Main execution
const result = processFiles();

console.log(`\nResults:`);
console.log(`  Essencetapping Asmodian: ${result.essencetappingAsmodian.length} nodes`);
console.log(`  Essencetapping Elyos: ${result.essencetappingElyos.length} nodes`);
console.log(`  Essencetapping Reshanta: ${result.essencetappingReshanta.length} nodes`);
console.log(`  Aethertapping Asmodian: ${result.aethertappingAsmodian.length} nodes`);
console.log(`  Aethertapping Elyos: ${result.aethertappingElyos.length} nodes`);
console.log(`  Aethertapping Reshanta: ${result.aethertappingReshanta.length} nodes`);

// Write output files
const dataDir = path.join(__dirname, 'src', 'data');

fs.writeFileSync(
  path.join(dataDir, 'essencetapping-asmodian.ts'),
  generateTsFile(result.essencetappingAsmodian, 'essencetappingAsmodian', 'essencetapping', 'asmodian')
);

fs.writeFileSync(
  path.join(dataDir, 'essencetapping-elyos.ts'),
  generateTsFile(result.essencetappingElyos, 'essencetappingElyos', 'essencetapping', 'elyos')
);

fs.writeFileSync(
  path.join(dataDir, 'essencetapping-reshanta.ts'),
  generateTsFile(result.essencetappingReshanta, 'essencetappingReshanta', 'essencetapping', 'reshanta')
);

fs.writeFileSync(
  path.join(dataDir, 'aethertapping-asmodian.ts'),
  generateTsFile(result.aethertappingAsmodian, 'aethertappingAsmodian', 'aethertapping', 'asmodian')
);

fs.writeFileSync(
  path.join(dataDir, 'aethertapping-elyos.ts'),
  generateTsFile(result.aethertappingElyos, 'aethertappingElyos', 'aethertapping', 'elyos')
);

fs.writeFileSync(
  path.join(dataDir, 'aethertapping-reshanta.ts'),
  generateTsFile(result.aethertappingReshanta, 'aethertappingReshanta', 'aethertapping', 'reshanta')
);

console.log(`\nFiles written successfully!`);
