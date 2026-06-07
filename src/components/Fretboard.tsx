import { useEffect, useMemo, useState } from 'react';
import type { SyntheticEvent } from 'react';
import type { ChordShape, FingerPosition } from '../data/chordTypes';
import { fingerName } from '../lib/fingerLabels';
import { fretboardImageClassName, fretboardImageFrameClassName } from '../lib/fretboardImageClass';

type Props = {
  shape: ChordShape;
  size?: 'thumb' | 'large';
};

const nutX = 70;
const rightX = 460;
const stringYs: Record<number, number> = {
  1: 60,
  2: 100,
  3: 140,
  4: 180,
  5: 220,
  6: 260,
};

function maxRenderedFret(positions: FingerPosition[]): number {
  const max = positions.reduce((acc, position) => Math.max(acc, position.fret ?? 0), 0);
  return Math.max(3, max);
}

function fretCenter(fret: number, fretCount: number): number {
  const space = (rightX - nutX) / fretCount;
  return nutX + (fret - 0.5) * space;
}

function fretLineX(fret: number, fretCount: number): number {
  const space = (rightX - nutX) / fretCount;
  return nutX + fret * space;
}

function fingerXPercent(fret: number, fretCount: number): number {
  return (fretCenter(fret, fretCount) / 560) * 100;
}

function fingerYPercent(stringNumber: number): number {
  return (stringYs[stringNumber] / 320) * 100;
}

function publicChordAsset(path: string): string {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
  return `${base}${path.replace(/^\//, '')}`;
}

function preventChordImageDownload(event: SyntheticEvent): void {
  event.preventDefault();
}

export default function Fretboard({ shape, size = 'thumb' }: Props) {
  const imageUrl = shape.uploadedImageUrl ?? shape.image;
  const [imageFailed, setImageFailed] = useState(false);
  const [usePlaceholder, setUsePlaceholder] = useState(false);
  const fretCount = useMemo(() => maxRenderedFret(shape.positions), [shape.positions]);
  const isLarge = size === 'large';

  useEffect(() => {
    setImageFailed(false);
    setUsePlaceholder(false);
  }, [imageUrl]);

  if (imageUrl && !imageFailed) {
    return (
      <div className={fretboardImageFrameClassName(size)} onContextMenu={preventChordImageDownload}>
        <img
          src={usePlaceholder ? publicChordAsset('/chords/placeholders/chord-placeholder.svg') : imageUrl}
          alt={`${shape.title} 기타 코드 다이어그램`}
          loading="lazy"
          draggable={false}
          className={fretboardImageClassName(size)}
          onContextMenu={preventChordImageDownload}
          onDragStart={preventChordImageDownload}
          onError={() => {
            if (usePlaceholder) {
              setImageFailed(true);
              return;
            }

            setUsePlaceholder(true);
          }}
        />
        <div className="finger-tooltip-layer" aria-hidden="false">
          {shape.positions.map((position) => {
            if (!position.finger || !position.fret || position.open || position.muted) {
              return null;
            }

            const label = fingerName(position.finger);

            return (
              <span
                key={`finger-tip-${position.string}-${position.fret}-${position.finger}`}
                className={`finger-tooltip-target finger-tooltip-target--${size}`}
                style={{
                  left: `${fingerXPercent(position.fret, fretCount)}%`,
                  top: `${fingerYPercent(position.string)}%`,
                }}
                tabIndex={0}
                aria-label={label}
              >
                <span className="finger-tooltip-label" role="tooltip">
                  {label}
                </span>
              </span>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <svg
      viewBox="0 0 560 320"
      role="img"
      aria-label={`${shape.title} 기타 코드 다이어그램`}
      className={isLarge ? 'mx-auto w-full max-w-5xl drop-shadow-lg' : 'w-full'}
      onContextMenu={preventChordImageDownload}
      onDragStart={preventChordImageDownload}
    >
      <rect x="0" y="0" width="560" height="320" rx="18" fill="#fffefe" />
      <text x="28" y="40" fill="#2f55a4" fontSize="28" fontWeight="800">
        |{shape.root}
      </text>

      <rect x={nutX - 8} y="48" width="12" height="224" rx="6" fill="#9ca3af" />

      {Array.from({ length: 6 }, (_, index) => index + 1).map((stringNumber) => (
        <g key={`string-${stringNumber}`}>
          <line
            x1={nutX}
            y1={stringYs[stringNumber]}
            x2={rightX}
            y2={stringYs[stringNumber]}
            stroke="#ef1b24"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <text x="488" y={stringYs[stringNumber] + 8} fill="#ef1b24" fontSize="20" fontWeight="800">
            {stringNumber}번줄
          </text>
        </g>
      ))}

      {Array.from({ length: fretCount }, (_, index) => index + 1).map((fret) => {
        const x = fretLineX(fret, fretCount);
        const labelX = fretCenter(fret, fretCount);

        return (
          <g key={`fret-${fret}`}>
            <line x1={x} y1="50" x2={x} y2="270" stroke="#13a75b" strokeWidth="4" strokeLinecap="round" />
            <rect x={labelX - 36} y="288" width="72" height="26" rx="13" fill="#0ea95a" />
            <text x={labelX} y="307" fill="#ffffff" textAnchor="middle" fontSize="17" fontWeight="800">
              {fret}프렛
            </text>
          </g>
        );
      })}

      {shape.positions.map((position) => {
        const y = stringYs[position.string];

        if (position.muted || position.open) {
          return (
            <text
              key={`marker-${position.string}`}
              x="38"
              y={y + 8}
              textAnchor="middle"
              fill={position.muted ? '#ef1b24' : '#0f9f59'}
              fontSize="24"
              fontWeight="900"
            >
              {position.muted ? 'x' : 'o'}
            </text>
          );
        }

        if (!position.fret) {
          return null;
        }

        const x = fretCenter(position.fret, fretCount);
        const label = position.finger ? fingerName(position.finger) : null;

        return (
          <g
            key={`finger-${position.string}-${position.fret}`}
            className="svg-finger-tooltip-target"
            transform={`translate(${x} ${y})`}
            aria-label={label ?? undefined}
            tabIndex={label ? 0 : undefined}
          >
            {label ? <title>{label}</title> : null}
            <rect x="-32" y="-18" width="64" height="36" rx="18" fill="#fffdf8" stroke="#232323" strokeWidth="3" />
            <line x1="-14" y1="-6" x2="14" y2="-15" stroke="#262626" strokeWidth="3" strokeLinecap="round" />
            <circle className="svg-finger-ring" cx="0" cy="0" r="25" fill="none" />
            <circle cx="0" cy="0" r="11" fill="#1f1f1d" />
            {position.finger ? (
              <text x="0" y="31" fill="#262626" textAnchor="middle" fontSize="13" fontWeight="800">
                {position.finger}
              </text>
            ) : null}
          </g>
        );
      })}
    </svg>
  );
}
