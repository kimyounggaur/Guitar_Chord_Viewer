import { Home, Lock, LogIn, LogOut, Search } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

type Props = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onHome: () => void;
  isAdmin: boolean;
  adminError: string | null;
  onAdminLogin: (id: string, password: string) => boolean;
  onAdminLogout: () => void;
};

export default function AppHeader({
  searchTerm,
  onSearchChange,
  onHome,
  isAdmin,
  adminError,
  onAdminLogin,
  onAdminLogout,
}: Props) {
  const [loginOpen, setLoginOpen] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (onAdminLogin(adminId, adminPassword)) {
      setLoginOpen(false);
      setAdminPassword('');
    }
  };

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
      <div className="header-mascot-stage" aria-hidden="true">
        <svg className="header-mascot" viewBox="0 0 180 88" role="img">
          <g className="mascot-shadow">
            <ellipse cx="90" cy="77" rx="31" ry="5" fill="rgba(15, 23, 42, 0.12)" />
          </g>
          <g className="mascot-body">
            <circle cx="74" cy="28" r="16" fill="#fff7ed" stroke="#fb7185" strokeWidth="3" />
            <path d="M61 27c4-14 23-16 29-4 1 2 1 5 0 8-8-5-18-5-29-4Z" fill="#f9a8d4" />
            <circle cx="69" cy="29" r="2.4" fill="#3f3f46" />
            <circle cx="80" cy="29" r="2.4" fill="#3f3f46" />
            <path d="M70 36c4 3 8 3 12 0" fill="none" stroke="#fb7185" strokeLinecap="round" strokeWidth="2" />

            <path d="M62 45c7-10 25-10 32 0l-4 22H66l-4-22Z" fill="#a7f3d0" stroke="#10b981" strokeWidth="3" />
            <path className="mascot-leg-left" d="M72 66l-7 10" fill="none" stroke="#475569" strokeLinecap="round" strokeWidth="5" />
            <path className="mascot-leg-right" d="M84 66l8 10" fill="none" stroke="#475569" strokeLinecap="round" strokeWidth="5" />

            <g className="mascot-guitar">
              <path d="M91 47c10-8 21-8 28 0 5 6 4 15-2 20-8 6-20 2-25-7-2-4-3-9-1-13Z" fill="#fbbf24" stroke="#92400e" strokeWidth="3" />
              <circle cx="105" cy="56" r="6" fill="#7c2d12" />
              <path d="M115 48l29-18" stroke="#92400e" strokeLinecap="round" strokeWidth="5" />
              <path d="M139 28l9-5" stroke="#92400e" strokeLinecap="round" strokeWidth="8" />
              <path d="M98 52l40-24M100 58l42-25M101 63l43-27" stroke="#fff7ed" strokeLinecap="round" strokeWidth="1.5" />
            </g>

            <path className="mascot-arm-left" d="M65 48c-8 2-12 7-13 13" fill="none" stroke="#fb7185" strokeLinecap="round" strokeWidth="5" />
            <path className="mascot-arm-right" d="M88 48c7 3 12 8 16 13" fill="none" stroke="#fb7185" strokeLinecap="round" strokeWidth="5" />
            <g className="mascot-notes" fill="#38bdf8">
              <path d="M34 32v14a5 5 0 1 1-3-5V28h13v5H34Z" />
              <path d="M151 47v12a4 4 0 1 1-3-4V43h11v4h-8Z" />
            </g>
          </g>
        </svg>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <div className="admin-access">
          {isAdmin ? (
            <div className="flex items-center gap-2">
              <span className="admin-status-pill">
                <Lock size={14} aria-hidden="true" />
                관리자
              </span>
              <button
                type="button"
                onClick={onAdminLogout}
                className="admin-header-button"
                aria-label="관리자 로그아웃"
              >
                <LogOut size={16} aria-hidden="true" />
                로그아웃
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setLoginOpen((open) => !open)}
                className="admin-header-button"
                aria-label="관리자 로그인"
                aria-expanded={loginOpen}
                aria-controls="admin-login-panel"
              >
                <Lock size={16} aria-hidden="true" />
                관리자 로그인
              </button>
              {loginOpen ? (
                <form id="admin-login-panel" className="admin-login-panel" onSubmit={handleLoginSubmit}>
                  <label className="admin-access-field">
                    <span>아이디</span>
                    <input
                      type="text"
                      value={adminId}
                      onChange={(event) => setAdminId(event.target.value)}
                      autoComplete="username"
                      required
                    />
                  </label>
                  <label className="admin-access-field">
                    <span>비밀번호</span>
                    <input
                      type="password"
                      value={adminPassword}
                      onChange={(event) => setAdminPassword(event.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </label>
                  {adminError ? <p className="admin-access-error">{adminError}</p> : null}
                  <button type="submit" className="admin-access-submit">
                    <LogIn size={16} aria-hidden="true" />
                    로그인
                  </button>
                </form>
              ) : null}
            </>
          )}
        </div>
        <button
          type="button"
          onClick={onHome}
          className="font-display text-xl font-extrabold tracking-[0.18em] text-rose-300 transition hover:text-rose-400 focus:outline-none focus-visible:rounded-full focus-visible:ring-4 focus-visible:ring-rose-100 sm:text-2xl"
        >
          Lesson Designer
        </button>
      </div>
    </header>
  );
}
