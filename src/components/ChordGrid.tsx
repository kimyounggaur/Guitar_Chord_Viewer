import type { ChordShape } from '../data/chordTypes';
import type { ChordQuality } from '../data/chordQualities';
import ChordCard from './ChordCard';
import EmptyState from './EmptyState';

type Props = {
  chords: ChordShape[];
  quality: ChordQuality | null;
  searchTerm: string;
  onSelectChord: (shape: ChordShape) => void;
};

export default function ChordGrid({ chords, quality, searchTerm, onSelectChord }: Props) {
  if (chords.length === 0) {
    return <EmptyState message={searchTerm ? '검색 결과가 없습니다.' : '아직 등록된 코드가 없습니다.'} />;
  }

  return (
    <section className="mx-auto max-w-[1180px] px-5 pb-12 sm:px-8">
      <div className="mb-5 flex items-end justify-between gap-4">
        <h1
          className="font-display text-3xl font-extrabold text-stone-700 sm:text-4xl"
          style={{ color: quality?.color ?? '#44403c' }}
        >
          {quality ? quality.label : 'Search'}
        </h1>
        <span className="rounded-full border border-emerald-100 bg-white px-4 py-2 text-sm font-bold text-emerald-600 shadow-neumorphic">
          {chords.length} chords
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {chords.map((shape, index) => (
          <ChordCard key={shape.id} shape={shape} onSelect={onSelectChord} featured={index === 0} />
        ))}
      </div>
    </section>
  );
}
