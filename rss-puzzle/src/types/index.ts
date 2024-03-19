export interface UserData {
  firstName: string;
  surname: string;

  settings?: UserSettings;
}

export interface UserSettings {
  translateHint: boolean;
  pronunciationHint: boolean;
  backgroundHint: boolean;
}

export enum PagesId {
  login = 'login',
  start = 'start',
  main = 'main',
}

export interface RoundSentence {
  audioExample: string;
  textExample: string;
  textExampleTranslate: string;
  id: number;
  word: string;
  wordTranslate: string;
}

export interface WordCollection {
  rounds: Round[];
  roundsCount: number;
}

export interface Round {
  levelData: object;
  words: RoundSentence[];
}
