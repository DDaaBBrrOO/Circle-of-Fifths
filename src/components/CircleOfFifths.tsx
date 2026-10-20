import React, { useMemo } from 'react';
import { CIRCLE_OF_FIFTHS, getNoteIndex, NOTES } from '../data/musicData';

interface CircleOfFifthsProps {
  selectedKey: string;
  keyType: 'major' | 'minor';
  onKeySelect: (key: string, type: 'major' | 'minor') => void;
  highlightedNotes?: string[];
}

const CircleOfFifths: React.FC<CircleOfFifthsProps> = ({
  selectedKey,
  keyType,
  onKeySelect,
  highlightedNotes = [],
}) => {
  const cx = 200;
  const cy = 200;
  const outerRadius = 180;
  const middleRadius = 140;
  const innerRadius = 95;

  // Get relative minor for each major key
  const getRelativeMinor = (majorKey: string): string => {
    const idx = getNoteIndex(majorKey);
    return NOTES[(idx + 9) % 12];
  };

  // Calculate rotation so selected key is at 12 o'clock (top)
  const rotationDeg = useMemo(() => {
    const selectedIndex = CIRCLE_OF_FIFTHS.indexOf(selectedKey);
    if (selectedIndex === -1) return 0;
    return -(selectedIndex * 30);
  }, [selectedKey]);

  const rotationRad = (rotationDeg * Math.PI) / 180;

  const getBaseAngle = (index: number): number => {
    return (index * 30 - 90) * (Math.PI / 180);
  };

  // Get angle with rotation applied
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

  const isSelected = (key: string, type: 'major' | 'minor'): boolean => {
    return selectedKey === key && keyType === type;
  };

  const isHighlighted = (note: string): boolean => {
    return highlightedNotes.includes(note);
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
          {/* Outer ring - Major keys (segments only) */}
          {CIRCLE_OF_FIFTHS.map((key, i) => {
            const baseAngle = getBaseAngle(i);
            const selected = isSelected(key, 'major');
            const highlighted = isHighlighted(key);

            return (
              <path
                key={`major-seg-${i}`}
                d={getArcPath(baseAngle, halfSegment, middleRadius, outerRadius)}
                fill={selected ? '#FFD700' : highlighted ? 'rgba(255, 215, 0, 0.25)' : '#2d2d44'}
                stroke={selected ? '#FFD700' : '#3d3d5c'}
                strokeWidth={selected ? 2.5 : 1}
                onClick={() => handleSegmentClick(i, 'major')}
                className="cursor-pointer hover:brightness-125 transition-all duration-200"
              />
            );
          })}

          {/* Inner ring - Minor keys (segments only) */}
          {CIRCLE_OF_FIFTHS.map((majorKey, i) => {
            const minorKey = getRelativeMinor(majorKey);
            const baseAngle = getBaseAngle(i);
            const selected = isSelected(minorKey, 'minor');
            const highlighted = isHighlighted(minorKey);

            return (
              <path
                key={`minor-seg-${i}`}
                d={getArcPath(baseAngle, halfSegment, innerRadius, middleRadius)}
                fill={selected ? '#4ECDC4' : highlighted ? 'rgba(78, 205, 196, 0.25)' : '#1f1f35'}
                stroke={selected ? '#4ECDC4' : '#2d2d44'}
                strokeWidth={selected ? 2.5 : 1}
                onClick={() => handleSegmentClick(i, 'minor')}
                className="cursor-pointer hover:brightness-125 transition-all duration-200"
              />
            );
          })}
        </g>

        {/* Text labels - positioned with transform for smooth animation */}
        {/* Major key labels */}
        {CIRCLE_OF_FIFTHS.map((key, i) => {
          const rotatedAngle = getRotatedAngle(i);
          const labelRadius = (outerRadius + middleRadius) / 2;
          const x = cx + labelRadius * Math.cos(rotatedAngle);
          const y = cy + labelRadius * Math.sin(rotatedAngle);
          const selected = isSelected(key, 'major');
          const highlighted = isHighlighted(key);

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
                fill={selected ? '#1a1a2e' : highlighted ? '#FFD700' : '#e0e0e0'}
                fontSize={selected ? '17' : '14'}
                fontWeight={selected || highlighted ? 'bold' : 'normal'}
                className="pointer-events-none"
              >
                {key}
              </text>
            </g>
          );
        })}

        {/* Minor key labels */}
        {CIRCLE_OF_FIFTHS.map((majorKey, i) => {
          const minorKey = getRelativeMinor(majorKey);
          const rotatedAngle = getRotatedAngle(i);
          const labelRadius = (middleRadius + innerRadius) / 2;
          const x = cx + labelRadius * Math.cos(rotatedAngle);
          const y = cy + labelRadius * Math.sin(rotatedAngle);
          const selected = isSelected(minorKey, 'minor');
          const highlighted = isHighlighted(minorKey);

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
                fill={selected ? '#1a1a2e' : highlighted ? '#4ECDC4' : '#a0a0a0'}
                fontSize={selected ? '13' : '11'}
                fontWeight={selected || highlighted ? 'bold' : 'normal'}
                className="pointer-events-none"
              >
                {minorKey}m
              </text>
            </g>
          );
        })}

        {/* Center circle with info (does not rotate) */}
        <circle cx={cx} cy={cy} r={innerRadius - 5} fill="#16162a" stroke="#2d2d44" strokeWidth="1" />
        
        {/* Triangle pointer at top */}
        <polygon
          points={`${cx},${cy - innerRadius + 8} ${cx - 7},${cy - innerRadius - 3} ${cx + 7},${cy - innerRadius - 3}`}
          fill={keyType === 'major' ? '#FFD700' : '#4ECDC4'}
          opacity="0.9"
        />
        
        <text
          x={cx}
          y={cy - 15}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={keyType === 'major' ? '#FFD700' : '#4ECDC4'}
          fontSize="24"
          fontWeight="bold"
        >
          {selectedKey}{keyType === 'minor' ? 'm' : ''}
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#888"
          fontSize="11"
        >
          {keyType === 'major' ? 'Major' : 'Minor'}
        </text>
      </svg>
    </div>
  );
};

export default CircleOfFifths;
