/** The full generated corpus (all 90 study records). Import only on research pages and in search. */
import corpusJson from "../data/generated/corpus.json";
import type { Corpus } from "./data";
export const corpus = corpusJson as unknown as Corpus;
export const studyByDay = (d: number) => corpus.studies.find((s) => s.day === d);
