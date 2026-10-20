import React, { useMemo } from 'react';
import { CIRCLE_OF_FIFTHS, getNoteIndex, NOTES, getScaleNotes, normalizeNoteName, formatKeyName } from '../data/musicData';

interface CircleOfFifthsProps {
  selectedKey: string;
  keyType: 'major' | 'minor';
  onKeySelect: (key: string, type: 'major' | 'minor') => void;
}

interface DiatonicChord {
  name: string;
  roman: string;
  quality: 'maj' | 'min' | 'dim';
}

const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({
  selectedKey,
  keyType,
  onKeySelect,
}) => {
  const cx = 200;
  const cy = 200;
  const outerRadius = 180;
  const middleRadius = 140;
  const innerRadius = 100;
  const innermostRadius = 65;

  // Get relative minor for each major key
  const getRelativeMinor = (majorKey: string): string => {
    const idx = getNoteIndex(majorKey);
    return NOTES[(idx + 9) % 12];
  };

  // Get diminished chord for each major key (vii° degree)
  const getDiminishedChord = (majorKey: string): string => {
    const idx = getNoteIndex(majorKey);
    return NOTES[(idx + 11) % 12]; // 11 semitones up = vii°
  };

  // Get diatonic chords for current key
  const diatonicChords = useMemo((): DiatonicChord[] => {
    const scaleNotes = getScaleNotes(selectedKey, keyType);
    
    if (keyType === 'major') {
      return [
        { name: scaleNotes[0], roman: 'I', quality: 'maj' },
        { name: scaleNotes[1] + 'm', roman: 'ii', quality: 'min' },
        { name: scaleNotes[2] + 'm', roman: 'iii', quality: 'min' },
        { name: scaleNotes[3], roman: 'IV', quality: 'maj' },
        { name: scaleNotes[4], roman: 'V', quality: 'maj' },
        { name: scaleNotes[5] + 'm', roman: 'vi', quality: 'min' },
        { name: scaleNotes[6] + '°', roman: 'vii°', quality: 'dim' },
      ];
    } else {
      return [
        { name: scaleNotes[0] + 'm', roman: 'i', quality: 'min' },
        { name: scaleNotes[1] + '°', roman: 'ii°', quality: 'dim' },
        { name: scaleNotes[2], roman: 'III', quality: 'maj' },
        { name: scaleNotes[3] + 'm', roman: 'iv', quality: 'min' },
        { name: scaleNotes[4] + 'm', roman: 'v', quality: 'min' },
        { name: scaleNotes[5], roman: 'VI', quality: 'maj' },
        { name: scaleNotes[6], roman: 'VII', quality: 'maj' },
      ];
    }
  }, [selectedKey, keyType]);

  // Calculate rotation so selected key is at 12 o'clock (top)
  const rotationDeg = useMemo(() => {
    if (keyType === 'major') {
      const selectedIndex = CIRCLE_OF_FIFTHS.indexOf(selectedKey);
      if (selectedIndex === -1) return 0;
      return -(selectedIndex * 30);
    } else {
      // For minor keys, find the major key that has this as relative minor
      for (let i = 0; i < CIRCLE_OF_FIFTHS.length; i++) {
        const relativeMinor = getRelativeMinor(CIRCLE_OF_FIFTHS[i]);
        if (relativeMinor === selectedKey) {
          return -(i * 30);
        }
      }
      return 0;
    }
  }, [selectedKey, keyType]);

  const rotationRad = (rotationDeg * Math.PI) / 180;

  const getBaseAngle = (index: number): number => {
    return (index * 30 - 90) * (Math.PI / 180);
  };

  const getRotatedAngle = (index: number): number => {
    return getBaseAngle(index) + rotationRad;
  };

  const getArcPath = (centerAngle: number, halfWidth: number, innerR: number, outerR: number): string => {
    const startAngle = centerAngle - halfWidth;
    const endAngle = centerAngle + halfWidth;
    
    const startOuter = {
      x: cx + outerR * Math.cos(startAngle),
      y: cy + outerR * Math.sin(startAngle),
    };
    const endOuter = {
      x: cx + outerR * Math.cos(endAngle),
      y: cy + outerR * Math.sin(endAngle),
    };
    const startInner = {
      x: cx + innerR * Math.cos(startAngle),
      y: cy + innerR * Math.sin(startAngle),
    };
    const endInner = {
      x: cx + innerR * Math.cos(endAngle),
      y: cy + innerR * Math.sin(endAngle),
    };

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

    return [
      `M ${startOuter.x} ${startOuter.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
      `L ${endInner.x} ${endInner.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}`,
      'Z',
    ].join(' ');
  };

  const handleSegmentClick = (index: number, type: 'major' | 'minor') => {
    const key = type === 'major' ? CIRCLE_OF_FIFTHS[index] : getRelativeMinor(CIRCLE_OF_FIFTHS[index]);
    onKeySelect(key, type);
  };

  // Check if a chord is in the current diatonic scale
  const getChordHighlight = (chordName: string, type: 'major' | 'minor' | 'dim'): { highlighted: boolean; roman: string; color: string } => {
    // Normalize the chord name to handle enharmonic equivalents
    const normalizeChordName = (name: string): string => {
      // Extract the root note (everything before 'm' or '°')
      let root = name;
      let suffix = '';
      
      if (name.endsWith('°')) {
        root = name.slice(0, -1);
        suffix = '°';
      } else if (name.endsWith('m')) {
        root = name.slice(0, -1);
        suffix = 'm';
      }
      
      // Normalize the root note
      const normalizedRoot = normalizeNoteName(root);
      return normalizedRoot + suffix;
    };
    
    const normalizedChordName = normalizeChordName(chordName);
    const diatonic = diatonicChords.find(d => {
      const normalizedDiatonic = normalizeChordName(d.name);
      return normalizedDiatonic === normalizedChordName;
    });
    
    if (diatonic) {
      let color = '#2d2d44';
      if (diatonic.quality === 'maj' && diatonic.roman !== 'I' && diatonic.roman !== 'i') {
        color = 'rgba(255, 215, 0, 0.3)'; // Transparent yellow for major
      } else if (diatonic.quality === 'min') {
        color = 'rgba(78, 205, 196, 0.3)'; // Transparent teal for minor
      } else if (diatonic.quality === 'dim') {
        color = 'rgba(231, 76, 60, 0.3)'; // Transparent red for diminished
      }
      return { highlighted: true, roman: diatonic.roman, color };
    }
    return { highlighted: false, roman: '', color: '#2d2d44' };
  };

  const halfSegment = Math.PI / 12;

  return (
    <div className="relative w-full max-w-[400px] mx-auto">
      <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
        {/* Background circle */}
        <circle cx={cx} cy={cy} r={outerRadius + 5} fill="#1a1a2e" stroke="#2d2d44" strokeWidth="2" />

        {/* Rotating segments group */}
        <g
          style={{
            transform: `rotate(${rotationDeg}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Outer ring - Major keys */}
          {CIRCLE_OF_FIFTHS.map((key, i) => {
            const baseAngle = getBaseAngle(i);
            const isSelected = selectedKey === key && keyType === 'major';
            const highlight = getChordHighlight(key, 'major');

            let fillColor = '#2d2d44';
            if (isSelected) {
              fillColor = '#FFD700';
            } else if (highlight.highlighted) {
              fillColor = highlight.color;
            }

            return (
              <path
                key={`major-seg-${i}`}
                d={getArcPath(baseAngle, halfSegment, middleRadius, outerRadius)}
                fill={fillColor}
                stroke={isSelected ? '#FFD700' : '#3d3d5c'}
                strokeWidth={isSelected ? 2.5 : 1}
                onClick={() => handleSegmentClick(i, 'major')}
                className="cursor-pointer hover:brightness-125 transition-all duration-200"
              />
            );
          })}

          {/* Middle ring - Minor keys */}
          {CIRCLE_OF_FIFTHS.map((majorKey, i) => {
            const minorKey = getRelativeMinor(majorKey);
            const baseAngle = getBaseAngle(i);
            const isSelected = selectedKey === minorKey && keyType === 'minor';
            const highlight = getChordHighlight(minorKey + 'm', 'minor');

            let fillColor = '#1f1f35';
            if (isSelected) {
              fillColor = '#4ECDC4';
            } else if (highlight.highlighted) {
              fillColor = highlight.color;
            }

            return (
              <path
                key={`minor-seg-${i}`}
                d={getArcPath(baseAngle, halfSegment, innerRadius, middleRadius)}
                fill={fillColor}
                stroke={isSelected ? '#4ECDC4' : '#2d2d44'}
                strokeWidth={isSelected ? 2.5 : 1}
                onClick={() => handleSegmentClick(i, 'minor')}
                className="cursor-pointer hover:brightness-125 transition-all duration-200"
              />
            );
          })}

          {/* Inner ring - Diminished chords */}
          {CIRCLE_OF_FIFTHS.map((majorKey, i) => {
            const dimChord = getDiminishedChord(majorKey) + '°';
            const baseAngle = getBaseAngle(i);
            const highlight = getChordHighlight(dimChord, 'dim');

            let fillColor = '#16162a';
            if (highlight.highlighted) {
              fillColor = highlight.color;
            }

            return (
              <path
                key={`dim-seg-${i}`}
                d={getArcPath(baseAngle, halfSegment, innermostRadius, innerRadius)}
                fill={fillColor}
                stroke={highlight.highlighted ? '#E74C3C' : '#2d2d44'}
                strokeWidth={highlight.highlighted ? 2 : 1}
                className="transition-all duration-200"
              />
            );
          })}
        </g>

        {/* Text labels - NOT rotating */}
        {/* Major key labels with roman numerals */}
        {CIRCLE_OF_FIFTHS.map((key, i) => {
          const rotatedAngle = getRotatedAngle(i);
          const labelRadius = (outerRadius + middleRadius) / 2;
          const x = cx + labelRadius * Math.cos(rotatedAngle);
          const y = cy + labelRadius * Math.sin(rotatedAngle);
          const isSelected = selectedKey === key && keyType === 'major';
          const highlight = getChordHighlight(key, 'major');

          return (
            <g
              key={`major-text-${i}`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <text
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isSelected ? '#1a1a2e' : highlight.highlighted ? '#FFD700' : '#e0e0e0'}
                fontSize={isSelected ? '17' : '14'}
                fontWeight={isSelected || highlight.highlighted ? 'bold' : 'normal'}
                className="pointer-events-none"
              >
                {key}
                {highlight.highlighted && (
                  <tspan
                    fontSize="9"
                    dx="2"
                    dy="3"
                    fill={isSelected ? '#1a1a2e' : '#FFD700'}
                    opacity="0.7"
                  >
                    {highlight.roman}
                  </tspan>
                )}
              </text>
            </g>
          );
        })}

        {/* Minor key labels with roman numerals */}
        {CIRCLE_OF_FIFTHS.map((majorKey, i) => {
          const minorKey = getRelativeMinor(majorKey);
          const rotatedAngle = getRotatedAngle(i);
          const labelRadius = (middleRadius + innerRadius) / 2;
          const x = cx + labelRadius * Math.cos(rotatedAngle);
          const y = cy + labelRadius * Math.sin(rotatedAngle);
          const isSelected = selectedKey === minorKey && keyType === 'minor';
          const highlight = getChordHighlight(minorKey + 'm', 'minor');

          return (
            <g
              key={`minor-text-${i}`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <text
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isSelected ? '#1a1a2e' : highlight.highlighted ? '#4ECDC4' : '#a0a0a0'}
                fontSize={isSelected ? '13' : '11'}
                fontWeight={isSelected || highlight.highlighted ? 'bold' : 'normal'}
                className="pointer-events-none"
              >
                {minorKey}m
                {highlight.highlighted && (
                  <tspan
                    fontSize="8"
                    dx="2"
                    dy="2"
                    fill={isSelected ? '#1a1a2e' : '#4ECDC4'}
                    opacity="0.7"
                  >
                    {highlight.roman}
                  </tspan>
                )}
              </text>
            </g>
          );
        })}

        {/* Diminished chord labels with roman numerals */}
        {CIRCLE_OF_FIFTHS.map((majorKey, i) => {
          const dimChord = getDiminishedChord(majorKey) + '°';
          const rotatedAngle = getRotatedAngle(i);
          const labelRadius = (innerRadius + innermostRadius) / 2;
          const x = cx + labelRadius * Math.cos(rotatedAngle);
          const y = cy + labelRadius * Math.sin(rotatedAngle);
          const highlight = getChordHighlight(dimChord, 'dim');

          return (
            <g
              key={`dim-text-${i}`}
              style={{
                transform: `translate(${x}px, ${y}px)`,
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
            >
              <text
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={highlight.highlighted ? '#E74C3C' : '#888'}
                fontSize="9"
                fontWeight={highlight.highlighted ? 'bold' : 'normal'}
                className="pointer-events-none"
              >
                {dimChord}
                {highlight.highlighted && (
                  <tspan
                    fontSize="7"
                    dx="1"
                    dy="2"
                    fill="#E74C3C"
                    opacity="0.7"
                  >
                    {highlight.roman}
                  </tspan>
                )}
              </text>
            </g>
          );
        })}

        {/* Center circle with info (does not rotate) */}
        <circle cx={cx} cy={cy} r={innermostRadius - 5} fill="#16162a" stroke="#2d2d44" strokeWidth="1" />
        
        {/* Triangle pointer at top */}
        <polygon
          points={`${cx},${cy - innermostRadius} ${cx - 7},${cy - innermostRadius - 10} ${cx + 7},${cy - innermostRadius - 10}`}
          fill={keyType === 'major' ? '#FFD700' : '#4ECDC4'}
          opacity="0.9"
        />
        
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={keyType === 'major' ? '#FFD700' : '#4ECDC4'}
          fontSize="20"
          fontWeight="bold"
        >
          {formatKeyName(selectedKey)}{keyType === 'minor' ? 'm' : ''}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#888"
          fontSize="10"
        >
          {keyType === 'major' ? 'Major' : 'Minor'}
        </text>
      </svg>
    </div>
  );
};

export default CircleOfFifths;
