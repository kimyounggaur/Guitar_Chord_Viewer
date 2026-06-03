import { ArrowLeft } from 'lucide-react';
import type { ChordShape } from '../data/chordTypes';
import type { ChordQuality } from '../data/chordQualities';
import ChordCard from './ChordCard';
import EmptyState from './EmptyState';

type Props = {
  chords: ChordShape[];
  quality: ChordQuality | null;
  searchTerm: string;
  onSelectChord: (shape: ChordShape) => void;
  onBack: () => void;
};

export default function ChordGrid({ chords, quality, searchTerm, onSelectChord, onBack }: Props) {
  if (chords.length === 0) {
    return (
      <section className="mx-auto min-h-[calc(100vh-clamp(76px,9vh,112px))] w-full max-w-[1760px] px-[clamp(24px,5vw,84px)] pb-[clamp(24px,4vh,56px)]">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex h-11 items-center gap-2 rounded-full border border-rose-100 bg-white px-4 font-bold text-stone-500 shadow-neumorphic transition hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"
        >
          <ArrowLeft size={18} aria-hidden="true" />
          뒤로
        </button>
        <EmptyState message={searchTerm ? '검색 결과가 없습니다.' : '아직 등록된 코드가 없습니다.'} />
      </section>
    );
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-clamp(76px,9vh,112px))] w-full max-w-[1760px] flex-col px-[clamp(24px,5vw,84px)] pb-[clamp(24px,4vh,56px)]">
      <div className="mb-[clamp(16px,2.4vh,30px)] flex items-end justify-between gap-4">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-rose-100 bg-white px-4 font-bold text-stone-500 shadow-neumorphic transition hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-100"
          >
            <ArrowLeft size={18} aria-hidden="true" />
            뒤로
          </button>
          <h1
            className="min-w-0 font-display text-3xl font-extrabold text-stone-700 sm:text-4xl"
            style={{ color: quality?.color ?? '#44403c' }}
          >
            {quality ? quality.label : 'Search'}
          </h1>
        </div>
        <span className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-bold text-emerald-600 shadow-neumorphic">
          {chords.length} chords
        </span>
      </div>
      <div className="chord-grid-surface grid flex-1 auto-rows-fr grid-cols-2 gap-[clamp(16px,1.6vw,28px)] md:grid-cols-3 lg:grid-cols-4">
        {chords.map((shape, index) => (
          <ChordCard key={shape.id} shape={shape} onSelect={onSelectChord} featured={index === 0} />
        ))}
      </div>
    </section>
  );
}
