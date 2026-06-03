import type { ChordShape } from '../data/chordTypes';
import Fretboard from './Fretboard';

type Props = {
  shape: ChordShape;
  onSelect: (shape: ChordShape) => void;
  featured?: boolean;
};

export default function ChordCard({ shape, onSelect, featured = false }: Props) {
  return (
    <button
      type="button"
      onClick={() => onSelect(shape)}
      className={[
        'chord-card group flex h-full min-h-[clamp(220px,28vh,360px)] flex-col gap-[clamp(12px,1.4vh,20px)] p-[clamp(14px,1.5vw,24px)] text-left focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100',
        featured ? 'sm:col-span-2 sm:min-h-[clamp(300px,43vh,520px)]' : '',
      ].join(' ')}
    >
      <span className="chord-card-title mx-auto px-[clamp(14px,1.4vw,22px)] py-1 text-center font-display text-[clamp(1rem,1.3vw,1.5rem)] font-extrabold text-emerald-600">
        {shape.title}
      </span>
      <span className="chord-card-fretboard flex min-h-0 flex-1 items-center justify-center">
        <Fretboard shape={shape} size="thumb" />
      </span>
    </button>
  );
}
