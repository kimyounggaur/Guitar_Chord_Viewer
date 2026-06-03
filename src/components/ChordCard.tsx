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
        'group flex h-full min-h-[230px] flex-col gap-4 rounded-[8px] bg-white p-3 text-left shadow-neumorphic transition duration-300 hover:scale-[1.03] focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100',
        featured ? 'sm:col-span-2 sm:min-h-[292px]' : '',
      ].join(' ')}
    >
      <span className="mx-auto rounded-[8px] border-2 border-dashed border-emerald-400 px-4 py-1 text-center font-display text-lg font-extrabold text-emerald-600">
        {shape.title}
      </span>
      <span className="flex min-h-0 flex-1 items-center">
        <Fretboard shape={shape} size="thumb" />
      </span>
    </button>
  );
}
