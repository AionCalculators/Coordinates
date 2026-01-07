import { CoordinateChunk, CoordinateFormat, Race } from '../types';

/**
 * Converts coordinates between pos formats
 * 
 * Supported input formats:
 * - With race indicator: [pos:name;race mapId X Y Z 0] where race is 0 (Elyos) or 1 (Asmodian)
 * - Without race indicator: [pos:name;mapId X Y Z 0]
 * 
 * Output formats:
 * - 'newer': returns pos format with race indicator [pos:name;race mapId X Y Z 0]
 * - 'older': returns pos format without race indicator [pos:name;mapId X Y Z 0]
 * 
 * @param coordinate - The coordinate string to convert
 * @param outputFormat - 'newer' (with race) or 'older' (without race)
 * @param race - Required for 'newer' output when input doesn't have race
 * 
 * Based on the logic from https://codepen.io/u3c/pen/MWPrPPm
 */
export function convertCoordinate(coordinate: string, outputFormat: CoordinateFormat, race?: Race): string {
  const raceNum = race === 'elyos' ? '0' : '1';
  
  // Check if input already has race indicator
  const withRaceMatch = coordinate.match(/\[pos:([^;]+);([01])\s+(\d+)\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+(\d+)\]/);
  
  if (withRaceMatch) {
    const [, name, inputRace, mapId, x, y, z, lastNum] = withRaceMatch;
    if (outputFormat === 'newer') {
      // Keep existing race or use provided race
      const finalRace = race ? raceNum : inputRace;
      return `[pos:${name};${finalRace} ${mapId} ${x} ${y} ${z} ${lastNum}]`;
    } else {
      // Remove race indicator for older format
      return `[pos:${name};${mapId} ${x} ${y} ${z} ${lastNum}]`;
    }
  }
  
  // Input is in format without race indicator: [pos:name;mapId X Y Z 0]
  const withoutRaceMatch = coordinate.match(/\[pos:([^;]+);(\d{6,})\s+([\d.-]+)\s+([\d.-]+)\s+([\d.-]+)\s+(\d+)\]/);
  
  if (withoutRaceMatch) {
    const [, name, mapId, x, y, z, lastNum] = withoutRaceMatch;
    if (outputFormat === 'newer') {
      // Add race indicator for newer format
      return `[pos:${name};${raceNum} ${mapId} ${x} ${y} ${z} ${lastNum}]`;
    } else {
      // Already in older format, return as-is
      return coordinate;
    }
  }
  
  // Return as-is if no match
  return coordinate;
}

/**
 * Converts multiple coordinates (one per line)
 */
export function convertCoordinates(coordinates: string[], outputFormat: CoordinateFormat, race?: Race): string[] {
  return coordinates.map(coord => convertCoordinate(coord, outputFormat, race));
}

/**
 * Splits coordinates into chunks for game input
 * Splits by number of coordinates per chunk
 */
export function splitIntoChunks(coordinates: string[], coordsPerChunk: number = 20): CoordinateChunk[] {
  const chunks: CoordinateChunk[] = [];
  
  for (let i = 0; i < coordinates.length; i += coordsPerChunk) {
    const chunkCoords = coordinates.slice(i, i + coordsPerChunk);
    chunks.push({
      index: chunks.length,
      content: chunkCoords.join('\n')
    });
  }

  return chunks;
}

/**
 * Processes coordinates: converts and splits into chunks
 */
export function processCoordinates(coords: string[], outputFormat: CoordinateFormat, race?: Race): CoordinateChunk[] {
  const converted = convertCoordinates(coords, outputFormat, race);
  return splitIntoChunks(converted);
}

/**
 * Extracts race from coordinate string (only works with race indicator format)
 * Format with race: [pos:name;race mapId X Y Z 0] where race is 0 (Elyos) or 1 (Asmodian)
 * Format without race: [pos:name;mapId X Y Z 0] - returns null
 * 
 * @returns 'elyos' for 0, 'asmodian' for 1, or null if no race indicator present
 */
export function extractRaceFromCoordinate(coordinate: string): Race | null {
  // Match new format: [pos:name;race mapId ...] where race is 0 or 1
  const match = coordinate.match(/\[pos:[^;]+;([01])\s+\d+/);
  
  if (match) {
    return match[1] === '0' ? 'elyos' : 'asmodian';
  }
  
  return null;
}
