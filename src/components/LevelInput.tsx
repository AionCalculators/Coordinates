import { useTranslation } from 'react-i18next';

interface LevelInputProps {
  level: number | null;
  onLevelChange: (level: number | null) => void;
  onClear: () => void;
}

export function LevelInput({ level, onLevelChange, onClear }: LevelInputProps) {
  const { t } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onLevelChange(null);
    } else {
      const num = parseInt(value, 10);
      if (!isNaN(num) && num >= 1 && num <= 499) {
        onLevelChange(num);
      }
    }
  };

  return (
    <div className="control-group level-group">
      <h3>{t('skillLevel')}</h3>
      <div className="level-input-row">
        <input
          type="number"
          className="level-input compact"
          placeholder={t('enterLevel')}
          value={level ?? ''}
          onChange={handleChange}
          min={1}
          max={499}
        />
        <button className="clear-btn compact" onClick={onClear}>
          {t('clearLevel')}
        </button>
      </div>
    </div>
  );
}
