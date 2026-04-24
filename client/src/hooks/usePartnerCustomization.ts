import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FeatureType } from '@/lib/api/partnerApi';
import { FEATURE_OPTIONS, VOICE_OPTIONS, submitPartner } from '@/lib/api/partnerApi';

type Selections = Record<FeatureType, string | null>;

const DEFAULT_SELECTIONS: Selections = {
  skin: null,
  hair: null,
  eyes: null,
  nose: null,
  mouth: null,
};

export function usePartnerCustomization() {
  const navigate = useNavigate();
  const [selections, setSelections] = useState<Selections>(DEFAULT_SELECTIONS);
  const [voice, setVoice] = useState<string>(VOICE_OPTIONS[0].id);
  const [activeFeature, setActiveFeature] = useState<FeatureType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function selectFeature(feature: FeatureType, optionId: string) {
    setSelections((prev) => ({ ...prev, [feature]: optionId }));
    setActiveFeature(null);
  }

  async function handleContinue() {
    const selectedVoice = VOICE_OPTIONS.find((v) => v.id === voice)!;
    const resolveOption = (feature: FeatureType) => {
      const sel = selections[feature];
      return sel ? (FEATURE_OPTIONS[feature].find((o) => o.id === sel)?.id ?? '') : '';
    };

    setIsSubmitting(true);
    try {
      await submitPartner({
        voiceConfig: { voiceName: selectedVoice.name, languageCode: selectedVoice.languageCode },
        personalityDescription: '',
        color: resolveOption('skin'),
        hair: resolveOption('hair'),
        eyes: resolveOption('eyes'),
        nose: resolveOption('nose'),
        mouth: resolveOption('mouth'),
      });
      navigate('/study');
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    selections,
    voice,
    setVoice,
    activeFeature,
    setActiveFeature,
    isSubmitting,
    selectFeature,
    handleContinue,
  };
}
