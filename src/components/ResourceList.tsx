import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ResourceNode, CoordinateFormat, CoordinateChunk, Race } from '../types';
import { processCoordinates } from '../utils/coordinateConverter';

interface ResourceListProps {
  groupedResources: Map<string, ResourceNode[]>;
  selectedMap: string | null;
  coordinateFormat: CoordinateFormat;
  race: Race;
}

interface GroupedResource {
  resourceKey: string;
  level: number;
  coordinates: string[];
  groupId: string;
}

function groupByKeyAndLevel(resources: ResourceNode[]): GroupedResource[] {
  const groups = new Map<string, GroupedResource>();
  
  for (const resource of resources) {
    const key = `${resource.resourceKey}-${resource.level}`;
    if (groups.has(key)) {
      groups.get(key)!.coordinates.push(resource.coordinates);
    } else {
      groups.set(key, {
        resourceKey: resource.resourceKey,
        level: resource.level,
        coordinates: [resource.coordinates],
        groupId: key,
      });
    }
  }
  
  return Array.from(groups.values());
}

interface ResourceCopyPanelProps {
  chunks: CoordinateChunk[];
  groupId: string;
}

function ResourceCopyPanel({ chunks, groupId }: ResourceCopyPanelProps) {
  const { t } = useTranslation();
  const [showTextareas, setShowTextareas] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [clickedIndices, setClickedIndices] = useState<Set<number>>(new Set());

  const handleCopy = async (content: string, index: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedIndex(index);
      setClickedIndices(prev => new Set(prev).add(index));
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  if (chunks.length === 0) {
    return null;
  }

  return (
    <div className="resource-copy-panel">
      <div className="resource-copy-controls">
        <div className="resource-copy-buttons">
          {chunks.map((chunk, index) => (
            <button
              key={`${groupId}-btn-${index}`}
              className={`chunk-btn primary small ${copiedIndex === index ? 'copied' : ''} ${clickedIndices.has(index) && copiedIndex !== index ? 'muted' : ''}`}
              onClick={() => handleCopy(chunk.content, index)}
            >
              {copiedIndex === index ? t('copied') : chunks.length > 1 ? `${t('copyChunk')} ${index + 1}` : t('copy')}
            </button>
          ))}
        </div>
        <button
          className="chunk-btn small"
          onClick={() => setShowTextareas(!showTextareas)}
        >
          {showTextareas ? t('hideTextarea') : t('showTextarea')}
        </button>
      </div>
      
      {showTextareas && (
        <div className="resource-textareas">
          {chunks.map((chunk, index) => (
            <div key={`${groupId}-textarea-${index}`} className="textarea-item compact">
              {chunks.length > 1 && (
                <div className="textarea-header">
                  <span className="chunk-label">{t('chunk')} {index + 1}</span>
                </div>
              )}
              <textarea
                className="chunk-textarea small"
                value={chunk.content}
                readOnly
                rows={Math.min(6, chunk.content.split('\n').length)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Convert resource key to display name (replace underscores with spaces)
function getResourceDisplayName(resourceKey: string): string {
  return resourceKey.replace(/_/g, ' ');
}

export function ResourceList({ groupedResources, selectedMap, coordinateFormat, race }: ResourceListProps) {
  const { t } = useTranslation();

  const mapsToShow = selectedMap 
    ? [[selectedMap, groupedResources.get(selectedMap) || []]] as [string, ResourceNode[]][]
    : Array.from(groupedResources.entries());

  if (mapsToShow.length === 0 || mapsToShow.every(([, resources]) => resources.length === 0)) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">📍</div>
        <div className="empty-state-text">{t('noResources')}</div>
      </div>
    );
  }

  return (
    <div className="resources-container">
      {mapsToShow.map(([mapKey, resources]) => {
        if (resources.length === 0) return null;
        const grouped = groupByKeyAndLevel(resources);
        
        return (
          <div key={mapKey} className="map-section">
            <div className="map-header">
              <h3 className="map-title">{t(`maps.${mapKey}`)}</h3>
              <span className="map-count">{resources.length}</span>
            </div>
            <div className="resources-list">
              {grouped.map(group => {
                const chunks = processCoordinates(group.coordinates, coordinateFormat, race);
                return (
                  <div key={group.groupId} className="resource-item">
                    <div className="resource-level">
                      {t('level')} {group.level}
                    </div>
                    <div className="resource-info">
                      <div className="resource-name">
                        {getResourceDisplayName(group.resourceKey)}
                        {group.coordinates.length > 1 && (
                          <span className="resource-count"> ({group.coordinates.length})</span>
                        )}
                      </div>
                      <ResourceCopyPanel chunks={chunks} groupId={group.groupId} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
