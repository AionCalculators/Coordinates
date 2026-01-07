import { useTranslation } from 'react-i18next';
import { CoordinateFormat, Race } from '../types';

interface FormatSelectionProps {
  selectedFormat: CoordinateFormat;
  onSelectFormat: (format: CoordinateFormat) => void;
  race: Race;
}

export function FormatSelection({ selectedFormat, onSelectFormat, race }: FormatSelectionProps) {
  const { t } = useTranslation();
  const raceIndicator = race === 'elyos' ? '0' : '1';

  return (
    <div className="format-selection">
      <h3>{t('outputFormat')}</h3>
      <div className="format-options">
        <label className={`format-option ${selectedFormat === 'newer' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="format"
            value="newer"
            checked={selectedFormat === 'newer'}
            onChange={() => onSelectFormat('newer')}
          />
          <span className="format-label">{t('newerFormat')}</span>
          <span className="format-example">[pos:name;{raceIndicator} mapId X Y Z 0]</span>
        </label>
        
        <label className={`format-option ${selectedFormat === 'older' ? 'selected' : ''}`}>
          <input
            type="radio"
            name="format"
            value="older"
            checked={selectedFormat === 'older'}
            onChange={() => onSelectFormat('older')}
          />
          <span className="format-label">{t('olderFormat')}</span>
          <span className="format-example">[pos:name;mapId X Y Z 0]</span>
        </label>
      </div>
    </div>
  );
}
