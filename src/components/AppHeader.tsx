import { Home, Search } from 'lucide-react';

type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onHome: () => void;
};

export default function AppHeader({ searchTerm, onSearchChange, onHome }: Props) {
  return (
    <header className="mx-auto flex h-[clamp(76px,9vh,112px)] w-full max-w-[1760px] flex-wrap items-center justify-between gap-4 px-[clamp(24px,5vw,84px)] py-4">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onHome}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-rose-100 bg-white text-rose-300 shadow-neumorphic transition hover:scale-105 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-200"
          aria-label="홈으로 이동"
        >
          <Home size={19} aria-hidden="true" />
        </button>
        <label className="relative min-w-[260px] flex-1 sm:max-w-[620px]">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-rose-300"
            size={20}
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => onSearchChange(event.target.value)}
            aria-label="Search guitar chords"
            placeholder="코드 검색"
            className="h-12 w-full rounded-full border-2 border-rose-100 bg-white/90 pl-12 pr-5 text-base font-semibold text-stone-700 shadow-neumorphic-inset outline-none transition focus:border-rose-200 focus:ring-4 focus:ring-rose-100"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={onHome}
        className="font-display text-xl font-extrabold tracking-[0.18em] text-rose-300 transition hover:text-rose-400 focus:outline-none focus-visible:rounded-full focus-visible:ring-4 focus-visible:ring-rose-100 sm:text-2xl"
      >
        Lesson Designer
      </button>
    </header>
  );
}
