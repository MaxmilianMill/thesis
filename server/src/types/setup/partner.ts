type PartnerVoiceConfig = {
    voiceName: string;
    languageCode: string;
    [key: string]: any;
}

type Partner = {
    voiceConfig: PartnerVoiceConfig;
    personalityDescription: string;
    hair: string;
    color: string;
    eyes: string;
    mouth: string;
    [key: string]: any;
}

export type {
    PartnerVoiceConfig,
    Partner
}