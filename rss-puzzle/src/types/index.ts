export interface UserData {
  firstName: string;
  surname: string;

  settings?: UserSettings;
}

export type UserLocalStorageData = {
  user: UserData;
  userStatistics: SentenceStatistics[];
  artMiniature: string;
};

export interface UserSettings {
  translateHint: boolean;
  pronunciationHint: boolean;
  backgroundHint: boolean;
}

export type SentenceStatistics = Pick<RoundSentence, 'textExample'> &
  Pick<RoundSentence, 'audioExample'> & { isHintUsed: boolean };

export enum PagesId {
  login = 'login',
  start = 'start',
  main = 'main',
  statistics = 'statistics',
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
  levelData: LevelData;
  words: RoundSentence[];
}

export interface LevelData {
  id: string;
  name: string;
  imageSrc: string;
  cutSrc: string;
  author: string;
  year: string;
}
