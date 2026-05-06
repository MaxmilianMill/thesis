import type { Partner } from '@thesis/types';
import { HttpStatusCode } from 'axios';
import { api } from './config';

export type FeatureType = 'skin' | 'hair' | 'eyes' | 'nose' | 'mouth';

export const FEATURE_LABELS: Record<FeatureType, string> = {
  skin: 'Skin Color',
  hair: 'Hat / Hair',
  eyes: 'Eyes',
  nose: 'Nose',
  mouth: 'Mouth',
};

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
    { id: 'skin-black', label: 'Black', placeholderColor: "#FFFFFF" }
  ],
  hair: [
    { id: 'hair-turban', label: 'Turban', placeholderColor: '#9E9E9E' },
    { id: 'hair-medium', label: 'Medium', placeholderColor: '#4A90E2' },
    { id: 'hair-long', label: 'Long', placeholderColor: '#7B5EA7' },
    { id: 'hair-pixie', label: 'Pixie', placeholderColor: '#F5A623' },
    { id: 'hair-punk', label: 'Punk', placeholderColor: '#F5A623' },
  ],
  eyes: [
    { id: 'eyes-round', label: 'Round', placeholderColor: '#5BA4E5' },
    { id: 'eyes-almond', label: 'Almond', placeholderColor: '#81C784' },
    { id: 'eyes-lashes', label: 'Lashes', placeholderColor: '#FF8A65' },
    { id: 'eyes-narrow', label: 'Narrow', placeholderColor: '#BA68C8' },
  ],
  nose: [
    { id: 'nose-curve', label: 'Curve', placeholderColor: '#FFAB40' },
    { id: 'nose-round', label: 'Round', placeholderColor: '#4DB6AC' },
    { id: 'nose-pointed', label: 'Pointed', placeholderColor: '#F06292' },
  ],
  mouth: [
    { id: 'mouth-smile', label: 'Smile', placeholderColor: '#EF5350' },
    { id: 'mouth-surprised', label: 'Surprised', placeholderColor: '#78909C' },
    { id: 'mouth-neutral', label: 'Neutral', placeholderColor: '#78909C' },
    { id: 'mouth-smirk', label: 'Smirk', placeholderColor: '#FF7043' },
    { id: 'mouth-frown', label: 'Frown', placeholderColor: '#AB47BC' },
  ],
};

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'samira', name: 'Samira', languageCode: 'en-US' },
  { id: 'marcus', name: 'Marcus', languageCode: 'en-US' },
];

export async function submitPartner(partner: Partner): Promise<Partner | undefined> {
  return api.post('/setup/update', { data: { partner } })
    .then((res) => {
      if (res.status !== HttpStatusCode.Ok) return undefined;
      return partner;
    })
    .catch((error) => {
      console.error(error.message);
      return undefined;
    });
}
