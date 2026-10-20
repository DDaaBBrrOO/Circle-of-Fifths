import React from 'react';
import { ChordShape } from '../data/musicData';

interface GuitarNeckProps {
  shape: ChordShape;
}

const STRING_NAMES = ['e', 'B', 'G', 'D', 'A', 'E'];
const NUM_FRETS_DISPLAY = 5;

const GuitarNeck: React.FC<GuitarNeckProps> = ({ shape }) => {
  const { frets, fingers, baseFret, barre } = shape;

  // SVG dimensions
  const svgWidth = 240;
  const svgHeight = 240;
  const marginLeft = 35;
  const marginRight = 15;
  const marginTop = 35;
  const marginBottom = 25;

  const neckWidth = svgWidth - marginLeft - marginRight;
  const neckHeight = svgHeight - marginTop - marginBottom;

  const stringSpacing = neckHeight / 5;
  const fretWidth = neckWidth / NUM_FRETS_DISPLAY;

  // String Y positions (top to bottom: high e to low E)
  const getStringY = (stringIdx: number): number => {
    return marginTop + stringIdx * stringSpacing;
  };

  // Fret X positions
  const getFretX = (fret: number): number => {
    return marginLeft + fret * fretWidth;
  };

  // Get the display fret for a given fretted note
  const getDisplayFret = (fret: number): number => {
    return fret - displayBaseFret + 1;
  };

  // Determine the display base fret
  const maxFret = Math.max(...frets.filter(f => f > 0));
  const displayBaseFret = maxFret <= 5 ? 1 : baseFret;

  return (
    <div className="flex flex-col items-center">
      <div className="text-sm text-gray-300 mb-3 font-medium">{shape.name}</div>
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full max-w-[260px]">
        {/* Background neck */}
        <rect
          x={marginLeft}
          y={marginTop - 5}
          width={neckWidth}
          height={neckHeight + 10}
          rx="4"
          fill="#2a1f0e"
          opacity="0.5"
        />

        {/* Frets (vertical lines) */}
        {Array.from({ length: NUM_FRETS_DISPLAY + 1 }, (_, i) => (
          <line
            key={`fret-${i}`}
            x1={getFretX(i)}
            y1={marginTop}
            x2={getFretX(i)}
            y2={marginTop + neckHeight}
            stroke={i === 0 ? '#e0e0e0' : '#888'}
            strokeWidth={i === 0 ? 3 : 1.5}
          />
        ))}

        {/* Strings (horizontal lines) */}
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={`string-${i}`}
            x1={marginLeft}
            y1={getStringY(i)}
            x2={marginLeft + neckWidth}
            y2={getStringY(i)}
            stroke="#c0c0c0"
            strokeWidth={1.5 - i * 0.15}
            opacity={0.8}
          />
        ))}

        {/* String names (right side) */}
        {Array.from({ length: 6 }, (_, i) => (
          <text
            key={`sname-${i}`}
            x={marginLeft + neckWidth + 10}
            y={getStringY(i) + 4}
            textAnchor="middle"
            fill="#666"
            fontSize="10"
            fontFamily="monospace"
          >
            {STRING_NAMES[i]}
          </text>
        ))}

        {/* Fret numbers at top */}
        {Array.from({ length: NUM_FRETS_DISPLAY }, (_, i) => (
          <text
            key={`fretnum-${i}`}
            x={getFretX(i) + fretWidth / 2}
            y={marginTop - 12}
            textAnchor="middle"
            fill="#555"
            fontSize="9"
          >
            {displayBaseFret + i}
          </text>
        ))}

        {/* Fret position dots on neck */}
        {[3, 5, 7, 9, 12].map(fretNum => {
          const displayFret = fretNum - displayBaseFret + 1;
          if (displayFret >= 1 && displayFret <= NUM_FRETS_DISPLAY) {
            return (
              <circle
                key={`marker-${fretNum}`}
                cx={getFretX(displayFret - 1) + fretWidth / 2}
                cy={marginTop + neckHeight + 12}
                r="3"
                fill="#444"
              />
            );
          }
          return null;
        })}

        {/* Barre indicator */}
        {barre && barre >= displayBaseFret && barre < displayBaseFret + NUM_FRETS_DISPLAY && (() => {
          const displayFret = barre - displayBaseFret + 1;
          // Find which strings are barred
          const barredStrings = frets
            .map((f, i) => f === barre ? i : -1)
            .filter(i => i !== -1);
          
          if (barredStrings.length > 1) {
            const minY = getStringY(Math.min(...barredStrings));
            const maxY = getStringY(Math.max(...barredStrings));
            return (
              <rect
                x={getFretX(displayFret - 1) + fretWidth * 0.15}
                y={minY - 8}
                width={fretWidth * 0.7}
                height={maxY - minY + 16}
                rx="8"
                fill="rgba(255, 215, 0, 0.2)"
                stroke="rgba(255, 215, 0, 0.5)"
                strokeWidth="1"
              />
            );
          }
          return null;
        })()}

        {/* Finger positions */}
        {frets.map((fret, stringIdx) => {
          if (fret === -1) {
            // Muted string - show X above nut
            return (
              <g key={`pos-${stringIdx}`}>
                <text
                  x={marginLeft - 15}
                  y={getStringY(stringIdx) + 4}
                  textAnchor="middle"
                  fill="#e74c3c"
                  fontSize="12"
                  fontWeight="bold"
                >
                  ✕
                </text>
              </g>
            );
          }
          if (fret === 0) {
            // Open string - show O above nut
            return (
              <g key={`pos-${stringIdx}`}>
                <circle
                  cx={marginLeft - 15}
                  cy={getStringY(stringIdx)}
                  r="5"
                  fill="none"
                  stroke="#4ECDC4"
                  strokeWidth="1.5"
                />
              </g>
            );
          }

          // Fretted note
          const displayFret = getDisplayFret(fret);
          if (displayFret >= 1 && displayFret <= NUM_FRETS_DISPLAY) {
            const dotX = getFretX(displayFret - 1) + fretWidth / 2;
            const dotY = getStringY(stringIdx);
            const finger = fingers[stringIdx];
            return (
              <g key={`pos-${stringIdx}`}>
                <circle
                  cx={dotX}
                  cy={dotY}
                  r="11"
                  fill="#FFD700"
                  stroke="#FFA500"
                  strokeWidth="1.5"
                />
                {finger > 0 && (
                  <text
                    x={dotX}
                    y={dotY + 1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#1a1a2e"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {finger}
                  </text>
                )}
              </g>
            );
          }
          return null;
        })}
      </svg>
    </div>
  );
};

export default GuitarNeck;
