import type { Interest } from "./interest.js";
import type { Language } from "./language.js"
import type { Level } from "./level.js";
import type { Mothertongue } from "./mothertongue.js";
import type { Partner } from "./partner.js";

export type Gender = "male" | "female" | "diverse";

export type UserInfo = {
    id: string;
    name?: string;
    uid: string;
    language: Language;
    level: Level;
    mothertongue?: Mothertongue;
    interests: Interest[];
    difficulties?: string[];
    partner?: Partner;
    ageRange?: string;
    gender?: Gender;
    fieldOfWork?: string;
    spokenLanguages?: string[];
    learningGoal?: string;
    learningTools?: string[];
};