import { useTranslation } from 'react-i18next';

interface MapFilterProps {
  maps: string[];
  selectedMap: string | null;
  onSelectMap: (map: string | null) => void;
}

export function MapFilter({ maps, selectedMap, onSelectMap }: MapFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="map-filter">
      <button
        className={`map-filter-btn ${selectedMap === null ? 'active' : ''}`}
        onClick={() => onSelectMap(null)}
      >
        {t('allMaps')}
      </button>
      {maps.map(map => (
        <button
          key={map}
          className={`map-filter-btn ${selectedMap === map ? 'active' : ''}`}
          onClick={() => onSelectMap(map)}
        >
          {t(`maps.${map}`)}
        </button>
      ))}
    </div>
  );
}
