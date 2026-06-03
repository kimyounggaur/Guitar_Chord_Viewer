import type { ChordQualityId } from '../data/chordTypes';
import { chordQualities } from '../data/chordQualities';
import QualityBubble from './QualityBubble';

type Props = {
  selectedQuality: ChordQualityId | null;
  onSelectQuality: (quality: ChordQualityId) => void;
};

export default function QualitySelector({ selectedQuality, onSelectQuality }: Props) {
  const naverSearchBannerSrc = `${import.meta.env.BASE_URL}naver-search-banner.jpg`;

  return (
    <section className="mx-auto flex min-h-[calc(100vh-clamp(76px,9vh,112px))] w-full max-w-[1500px] flex-col justify-between gap-[clamp(24px,5vh,64px)] px-[clamp(24px,5vw,84px)] py-[clamp(24px,5vh,72px)]">
      <div className="grid flex-1 grid-cols-3 content-center justify-items-center gap-x-[clamp(16px,3vw,56px)] gap-y-[clamp(22px,5vh,72px)] sm:grid-cols-4 md:grid-cols-6">
        {chordQualities.map((quality) => (
          <QualityBubble
            key={quality.id}
            quality={quality}
            active={selectedQuality === quality.id}
            onClick={() => onSelectQuality(quality.id)}
          />
        ))}
      </div>
      <img
        src={naverSearchBannerSrc}
        alt="네이버 한국생활음악강사협회 검색창"
        className="mx-auto h-auto w-full max-w-[980px] rounded-[8px] object-contain"
        loading="eager"
      />
    </section>
  );
}
