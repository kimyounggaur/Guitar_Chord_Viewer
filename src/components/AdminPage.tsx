import { ArrowLeft, ChevronRight, ImageUp, LayoutDashboard, Lock, SearchCheck, ShieldCheck } from 'lucide-react';
import type React from 'react';
import type { ChordQualityId } from '../data/chordTypes';

export type AdminQualityStat = {
  id: ChordQualityId;
  label: string;
  color: string;
  chordCount: number;
  uploadedCount: number;
  sourceImageCount: number;
};

type Props = {
  isAdmin: boolean;
  adminId: string | null;
  totalChords: number;
  uploadedImageCount: number;
  qualityStats: AdminQualityStat[];
  onHome: () => void;
  onSelectQuality: (quality: ChordQualityId) => void;
};

export default function AdminPage({
  isAdmin,
  adminId,
  totalChords,
  uploadedImageCount,
  qualityStats,
  onHome,
  onSelectQuality,
}: Props) {
  if (!isAdmin) {
    return (
      <section className="admin-page mx-auto min-h-[calc(100vh-clamp(76px,9vh,112px))] w-full max-w-[1280px] px-[clamp(24px,5vw,84px)] pb-[clamp(24px,4vh,56px)]">
        <button type="button" onClick={onHome} className="admin-back-button">
          <ArrowLeft size={18} aria-hidden="true" />
          홈으로
        </button>
        <div className="admin-locked-panel">
          <span className="admin-lock-mark">
            <Lock size={30} aria-hidden="true" />
          </span>
          <p className="admin-eyebrow">Admin</p>
          <h1>관리자 페이지</h1>
          <p>관리자 로그인 후 접근 가능합니다.</p>
        </div>
      </section>
    );
  }

  const sourceImageCount = qualityStats.reduce((total, item) => total + item.sourceImageCount, 0);

  return (
    <section className="admin-page mx-auto min-h-[calc(100vh-clamp(76px,9vh,112px))] w-full max-w-[1480px] px-[clamp(24px,5vw,84px)] pb-[clamp(24px,4vh,56px)]">
      <div className="admin-page-header">
        <div className="min-w-0">
          <p className="admin-eyebrow">
            <ShieldCheck size={16} aria-hidden="true" />
            {adminId ?? '관리자'}
          </p>
          <h1>관리자 페이지</h1>
        </div>
        <button type="button" onClick={onHome} className="admin-back-button">
          <ArrowLeft size={18} aria-hidden="true" />
          홈으로
        </button>
      </div>

      <div className="admin-metric-grid" aria-label="관리자 요약">
        <div className="admin-metric-card">
          <LayoutDashboard size={22} aria-hidden="true" />
          <span>전체 코드</span>
          <strong>{totalChords}</strong>
        </div>
        <div className="admin-metric-card admin-metric-card--green">
          <SearchCheck size={22} aria-hidden="true" />
          <span>검색 권한</span>
          <strong>활성</strong>
        </div>
        <div className="admin-metric-card admin-metric-card--blue">
          <ImageUp size={22} aria-hidden="true" />
          <span>기본 이미지</span>
          <strong>{sourceImageCount}</strong>
        </div>
        <div className="admin-metric-card admin-metric-card--rose">
          <ImageUp size={22} aria-hidden="true" />
          <span>업로드 이미지</span>
          <strong>{uploadedImageCount}</strong>
        </div>
      </div>

      <section className="admin-workspace" aria-labelledby="admin-quality-title">
        <div className="admin-workspace-header">
          <div>
            <p className="admin-eyebrow">Chord Images</p>
            <h2 id="admin-quality-title">코드 이미지 관리</h2>
          </div>
          <span>{uploadedImageCount} uploaded</span>
        </div>

        <div className="admin-quality-list">
          {qualityStats.map((quality) => (
            <button
              type="button"
              key={quality.id}
              onClick={() => onSelectQuality(quality.id)}
              className="admin-quality-row"
              style={{ '--quality-color': quality.color } as React.CSSProperties}
            >
              <span className="admin-quality-dot" aria-hidden="true" />
              <span className="admin-quality-name">
                <strong>{quality.label}</strong>
                <span>{quality.chordCount} chords</span>
              </span>
              <span className="admin-quality-count">
                {quality.uploadedCount}/{quality.chordCount}
              </span>
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          ))}
        </div>
      </section>
    </section>
  );
}
