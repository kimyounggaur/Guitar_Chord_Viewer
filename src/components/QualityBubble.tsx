import type React from 'react';
import type { ChordQuality } from '../data/chordQualities';

type Props = {
  quality: ChordQuality;
  active: boolean;
  onClick: () => void;
};

export default function QualityBubble({ quality, active, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="quality-bubble group relative aspect-square w-[86px] rounded-full bg-white text-center font-display text-[clamp(0.75rem,2.5vw,1.05rem)] font-extrabold shadow-neumorphic focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-100 sm:w-[112px] lg:w-[128px]"
      style={{
        border: `5px solid ${quality.color}`,
        color: quality.color,
        '--bubble-color': quality.color,
        transform: active ? 'scale(1.08)' : undefined,
        boxShadow: active
          ? `0 0 0 8px ${quality.color}1f, 7px 7px 15px rgba(0,0,0,.08), -7px -7px 15px rgba(255,255,255,.95)`
          : undefined,
      } as React.CSSProperties}
    >
      <span className="quality-bubble-sparkles" aria-hidden="true" />
      <span className="quality-bubble-core absolute inset-[12px] rounded-full shadow-neumorphic-inset" aria-hidden="true" />
      <span className="quality-bubble-label relative z-10 flex h-full items-center justify-center px-2 leading-tight">
        {quality.label}
      </span>
    </button>
  );
}
