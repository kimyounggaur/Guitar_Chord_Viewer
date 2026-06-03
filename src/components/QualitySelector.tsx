import type { ChordQualityId } from '../data/chordTypes';
import { chordQualities } from '../data/chordQualities';
import QualityBubble from './QualityBubble';

type Props = {
  selectedQuality: ChordQualityId | null;
  onSelectQuality: (quality: ChordQualityId) => void;
};

export default function QualitySelector({ selectedQuality, onSelectQuality }: Props) {
  return (
    <section className="mx-auto grid max-w-[920px] grid-cols-3 justify-items-center gap-x-4 gap-y-6 px-4 py-8 sm:grid-cols-4 sm:gap-x-5 md:grid-cols-6 md:gap-y-8">
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
