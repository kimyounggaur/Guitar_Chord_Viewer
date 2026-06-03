import { useMemo, useState } from 'react';
import AppHeader from './components/AppHeader';
import ChordDetail from './components/ChordDetail';
import ChordGrid from './components/ChordGrid';
import QualitySelector from './components/QualitySelector';
import { getChordQuality } from './data/chordQualities';
import { chords as staticChords } from './data/chords';
import type { ChordQualityId, ChordShape } from './data/chordTypes';
import { useAdminSession } from './hooks/useAdminSession';
import { useIndexedChordImages } from './hooks/useIndexedChordImages';
import { searchChords } from './hooks/useChordSearch';

type AppView = 'qualities' | 'grid' | 'detail';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuality, setSelectedQuality] = useState<ChordQualityId | null>(null);
  const [selectedChordId, setSelectedChordId] = useState<string | null>(null);
  const { imagesByChordId, error, saveImageForChord, deleteImageForChord } = useIndexedChordImages();
  const adminSession = useAdminSession();

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

  const view: AppView = selectedChord && !hasSearchTerm ? 'detail' : activeQuality || hasSearchTerm ? 'grid' : 'qualities';

  const handleHome = () => {
    setSelectedChordId(null);
    setSelectedQuality(null);
    setSearchTerm('');
  };

  const handleSelectQuality = (quality: ChordQualityId) => {
    setSelectedQuality(quality);
    setSelectedChordId(null);
  };

  const handleSelectChord = (shape: ChordShape) => {
    setSelectedQuality(shape.quality);
    setSelectedChordId(shape.id);
  };

  const handleSearchChange = (value: string) => {
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
    if (!adminSession.isAdmin) {
      return;
    }

    await saveImageForChord(chord, file);
  };

  const handleDeleteImage = async (chordId: string) => {
    if (!adminSession.isAdmin) {
      return;
    }

    await deleteImageForChord(chordId);
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#fbfbfb] text-stone-800">
      <AppHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onHome={handleHome}
        isAdmin={adminSession.isAdmin}
        adminError={adminSession.loginError}
        onAdminLogin={adminSession.login}
        onAdminLogout={adminSession.logout}
      />

      <div className="animate-[viewIn_.25s_ease_both]">
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
            canManageImages={adminSession.isAdmin}
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
