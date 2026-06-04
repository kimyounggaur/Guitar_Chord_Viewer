import { useEffect, useMemo, useState } from 'react';
import AppHeader from './components/AppHeader';
import AdminPage, { type AdminQualityStat } from './components/AdminPage';
import ChordDetail from './components/ChordDetail';
import ChordGrid from './components/ChordGrid';
import QualitySelector from './components/QualitySelector';
import { chordQualities, getChordQuality } from './data/chordQualities';
import { chords as staticChords } from './data/chords';
import type { ChordQualityId, ChordShape } from './data/chordTypes';
import { useCuteClickSound } from './hooks/useCuteClickSound';
import { useIndexedChordImages } from './hooks/useIndexedChordImages';
import { useSupabaseAuthSession } from './hooks/useSupabaseAuthSession';
import { searchChords } from './hooks/useChordSearch';

type AppView = 'qualities' | 'grid' | 'detail' | 'admin';

export default function App() {
  useCuteClickSound();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuality, setSelectedQuality] = useState<ChordQualityId | null>(null);
  const [selectedChordId, setSelectedChordId] = useState<string | null>(null);
  const [isAdminPageOpen, setIsAdminPageOpen] = useState(false);
  const { imagesByChordId, error, saveImageForChord, deleteImageForChord } = useIndexedChordImages();
  const authSession = useSupabaseAuthSession();
  const canSearch = authSession.isAdmin || authSession.isMember;

  useEffect(() => {
    if (!canSearch && searchTerm) {
      setSearchTerm('');
    }
  }, [canSearch, searchTerm]);

  const allChords = useMemo(
    () =>
      staticChords.map((chord) => {
        const uploaded = imagesByChordId[chord.id];
        return uploaded ? { ...chord, uploadedImageUrl: uploaded.url } : chord;
      }),
    [imagesByChordId],
  );

  const selectedChord = useMemo(
    () => allChords.find((chord) => chord.id === selectedChordId) ?? null,
    [allChords, selectedChordId],
  );

  const hasSearchTerm = searchTerm.trim().length > 0;
  const activeQuality = hasSearchTerm ? null : selectedQuality;

  const visibleChords = useMemo(
    () => searchChords(allChords, { searchTerm, selectedQuality: activeQuality }),
    [activeQuality, allChords, searchTerm],
  );

  const qualityStats = useMemo<AdminQualityStat[]>(
    () =>
      chordQualities.map((quality) => {
        const qualityChords = allChords.filter((chord) => chord.quality === quality.id);

        return {
          id: quality.id,
          label: quality.label,
          color: quality.color,
          chordCount: qualityChords.length,
          uploadedCount: qualityChords.filter((chord) => Boolean(imagesByChordId[chord.id])).length,
          sourceImageCount: qualityChords.filter((chord) => Boolean(chord.image)).length,
        };
      }),
    [allChords, imagesByChordId],
  );

  const uploadedImageCount = Object.keys(imagesByChordId).length;
  const view: AppView = isAdminPageOpen
    ? 'admin'
    : selectedChord && !hasSearchTerm
      ? 'detail'
      : activeQuality || hasSearchTerm
        ? 'grid'
        : 'qualities';

  const handleHome = () => {
    setIsAdminPageOpen(false);
    setSelectedChordId(null);
    setSelectedQuality(null);
    setSearchTerm('');
  };

  const handleSelectQuality = (quality: ChordQualityId) => {
    setIsAdminPageOpen(false);
    setSelectedQuality(quality);
    setSelectedChordId(null);
  };

  const handleSelectChord = (shape: ChordShape) => {
    setIsAdminPageOpen(false);
    setSelectedQuality(shape.quality);
    setSelectedChordId(shape.id);
  };

  const handleAdminPage = () => {
    setIsAdminPageOpen(true);
    setSelectedChordId(null);
    setSelectedQuality(null);
    setSearchTerm('');
  };

  const handleSearchChange = (value: string) => {
    if (!canSearch) {
      return;
    }

    setIsAdminPageOpen(false);
    setSearchTerm(value);
    if (value.trim()) {
      setSelectedChordId(null);
    }
  };

  const handleBack = () => {
    if (selectedChord) {
      setSelectedChordId(null);
      return;
    }

    setSelectedQuality(null);
    setSearchTerm('');
  };

  const handleSaveImage = async (chord: ChordShape, file: File) => {
    if (!authSession.isAdmin) {
      return;
    }

    await saveImageForChord(chord, file);
  };

  const handleDeleteImage = async (chordId: string) => {
    if (!authSession.isAdmin) {
      return;
    }

    await deleteImageForChord(chordId);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbfbfb] text-stone-800">
      <AppHeader
        searchTerm={searchTerm}
        canSearch={canSearch}
        onSearchChange={handleSearchChange}
        onHome={handleHome}
        onAdminPage={handleAdminPage}
        isAdminPageActive={view === 'admin'}
        isAuthLoading={authSession.isLoading}
        authConfigError={authSession.authConfigError}
        isMember={authSession.isMember}
        memberId={authSession.memberId}
        memberLoginError={authSession.loginError}
        memberSignupError={authSession.signupError}
        memberSignupMessage={authSession.signupMessage}
        onMemberSignup={authSession.signup}
        onMemberLogin={authSession.login}
        onMemberLogout={authSession.logout}
        isAdmin={authSession.isAdmin}
        adminError={authSession.adminError}
        onAdminLogin={authSession.adminLogin}
        onAdminLogout={authSession.logout}
      />

      <div className="animate-[viewIn_.25s_ease_both]">
        {view === 'admin' ? (
          <AdminPage
            isAdmin={authSession.isAdmin}
            adminId={authSession.memberId}
            totalChords={allChords.length}
            uploadedImageCount={uploadedImageCount}
            qualityStats={qualityStats}
            onHome={handleHome}
            onSelectQuality={handleSelectQuality}
          />
        ) : null}

        {view === 'qualities' ? (
          <QualitySelector selectedQuality={selectedQuality} onSelectQuality={handleSelectQuality} />
        ) : null}

        {view === 'grid' ? (
          <ChordGrid
            chords={visibleChords}
            quality={activeQuality ? getChordQuality(activeQuality) : null}
            searchTerm={searchTerm}
            onSelectChord={handleSelectChord}
            onBack={handleBack}
          />
        ) : null}

        {view === 'detail' && selectedChord ? (
          <ChordDetail
            chord={selectedChord}
            quality={getChordQuality(selectedChord.quality)}
            relatedChords={allChords.filter((chord) => chord.quality === selectedChord.quality)}
            uploadedImage={imagesByChordId[selectedChord.id]}
            uploadError={error}
            canManageImages={authSession.isAdmin}
            onSelectChord={handleSelectChord}
            onBack={handleBack}
            onSaveImage={handleSaveImage}
            onDeleteImage={handleDeleteImage}
          />
        ) : null}
      </div>
    </main>
  );
}
