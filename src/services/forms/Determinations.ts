import { AttackmentItem } from "./Attackment";

export interface Determinations {
    documentNumber: string;
    internalNumber: string;
    documentDate: number;
    fromDate: number;
    toDate: number;
    entryDate: number;
    files: AttackmentItem[];
  }
  