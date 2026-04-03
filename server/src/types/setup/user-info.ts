import type { Interest } from "./interest.js";
import type { Language } from "./language.js"
import type { Level } from "./level.js";
import type { Partner } from "./partner.js";

export type UserInfo = {
    name?: string;
    uid: string;
    language: Language;
    level: Level;
    interests: Interest[];
    partner?: Partner;
};