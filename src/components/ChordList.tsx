import React from 'react';

interface ChordListProps {
  chords: { roman: string; quality: string; root: string; name: string }[];
  selectedChord: string | null;
  onChordSelect: (chordName: string) => void;
  keyType: 'major' | 'minor';
}

const ChordList: React.FC<ChordListProps> = ({ chords, selectedChord, onChordSelect, keyType }) => {
  const getQualityColor = (quality: string): string => {
    switch (quality) {
      case 'maj': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      case 'min': return 'bg-teal-500/20 border-teal-500/50 text-teal-300';
      case 'dim': return 'bg-red-500/20 border-red-500/50 text-red-300';
      default: return 'bg-gray-500/20 border-gray-500/50 text-gray-300';
    }
  };

  const getQualityBadge = (quality: string): string => {
    switch (quality) {
      case 'maj': return 'M';
      case 'min': return 'm';
      case 'dim': return '°';
      default: return '';
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-2 h-2 rounded-full ${keyType === 'major' ? 'bg-yellow-400' : 'bg-teal-400'}`} />
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">
          Diatonic Chords
        </h3>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
        {chords.map((chord) => {
          const isSelected = selectedChord === chord.name;
          return (
            <button
              key={chord.name}
              onClick={() => onChordSelect(chord.name)}
              className={`
                relative flex flex-col items-center p-2 rounded-lg border transition-all duration-200
                ${isSelected
                  ? 'border-yellow-400 bg-yellow-400/20 scale-105 shadow-lg shadow-yellow-400/20'
                  : `${getQualityColor(chord.quality)} hover:scale-105`
                }
              `}
            >
              <span className="text-[10px] text-gray-400 font-mono">{chord.roman}</span>
              <span className="text-sm font-bold mt-0.5">{chord.name}</span>
              <span className="text-[9px] text-gray-500 mt-0.5">
                {getQualityBadge(chord.quality)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChordList;
