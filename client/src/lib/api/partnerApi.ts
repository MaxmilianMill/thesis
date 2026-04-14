import type { Partner } from '@thesis/types';

export type FeatureType = 'skin' | 'hair' | 'eyes' | 'nose' | 'mouth';

export type FeatureOption = {
  id: string;
  label: string;
  placeholderColor: string;
};

export type VoiceOption = {
  id: string;
  name: string;
  languageCode: string;
};

export const FEATURE_OPTIONS: Record<FeatureType, FeatureOption[]> = {
  skin: [
    { id: 'skin-light', label: 'Light', placeholderColor: '#F5CBA7' },
    { id: 'skin-medium', label: 'Medium', placeholderColor: '#D4A077' },
    { id: 'skin-tan', label: 'Tan', placeholderColor: '#C68642' },
    { id: 'skin-dark', label: 'Dark', placeholderColor: '#8D5524' },
  ],
  hair: [
    { id: 'hair-none', label: 'None', placeholderColor: '#9E9E9E' },
    { id: 'hair-cap', label: 'Cap', placeholderColor: '#4A90E2' },
    { id: 'hair-curly', label: 'Curly', placeholderColor: '#7B5EA7' },
    { id: 'hair-straight', label: 'Straight', placeholderColor: '#F5A623' },
  ],
  eyes: [
    { id: 'eyes-round', label: 'Round', placeholderColor: '#5BA4E5' },
    { id: 'eyes-almond', label: 'Almond', placeholderColor: '#81C784' },
    { id: 'eyes-wide', label: 'Wide', placeholderColor: '#FF8A65' },
    { id: 'eyes-narrow', label: 'Narrow', placeholderColor: '#BA68C8' },
  ],
  nose: [
    { id: 'nose-small', label: 'Small', placeholderColor: '#FFAB40' },
    { id: 'nose-button', label: 'Button', placeholderColor: '#4DB6AC' },
    { id: 'nose-wide', label: 'Wide', placeholderColor: '#F06292' },
    { id: 'nose-straight', label: 'Straight', placeholderColor: '#AED581' },
  ],
  mouth: [
    { id: 'mouth-smile', label: 'Smile', placeholderColor: '#EF5350' },
    { id: 'mouth-neutral', label: 'Neutral', placeholderColor: '#78909C' },
    { id: 'mouth-wide', label: 'Wide', placeholderColor: '#FF7043' },
    { id: 'mouth-small', label: 'Small', placeholderColor: '#AB47BC' },
  ],
};

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'samira', name: 'Samira', languageCode: 'en-US' },
  { id: 'marcus', name: 'Marcus', languageCode: 'en-US' },
  { id: 'leila', name: 'Leila', languageCode: 'en-US' },
];

export async function submitPartner(_partner: Partner): Promise<void> {
  return new Promise((resolve) => setTimeout(() => resolve(), 500));
}
