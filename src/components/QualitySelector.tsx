import type { ChordQualityId } from '../data/chordTypes';
import { chordQualities } from '../data/chordQualities';
import QualityBubble from './QualityBubble';

type Props = {
  selectedQuality: ChordQualityId | null;
  onSelectQuality: (quality: ChordQualityId) => void;
};

export default function QualitySelector({ selectedQuality, onSelectQuality }: Props) {
  return (
    <section className="mx-auto grid min-h-[calc(100vh-clamp(76px,9vh,112px))] w-full max-w-[1500px] grid-cols-3 content-center justify-items-center gap-x-[clamp(16px,3vw,56px)] gap-y-[clamp(22px,5vh,72px)] px-[clamp(24px,5vw,84px)] py-[clamp(24px,5vh,72px)] sm:grid-cols-4 md:grid-cols-6">
      {chordQualities.map((quality) => (
        <QualityBubble
          key={quality.id}
          quality={quality}
          active={selectedQuality === quality.id}
          onClick={() => onSelectQuality(quality.id)}
        />
      ))}
    </section>
  );
}
