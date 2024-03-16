import wordCollectionLevel1 from '../data/wordCollection/wordCollectionLevel1';
import { WordCollection, Round } from '../types';

export class SentenceService {
  private wordCollections: WordCollection[];

  private wordCollectionLevel: WordCollection;

  constructor(wordCollections: WordCollection[]) {
    this.wordCollections = wordCollections;
    this.wordCollectionLevel = this.setWordCollectionLevel(1);
  }

  public setWordCollectionLevel(level: number): WordCollection {
    const index = level - 1;
    this.wordCollectionLevel = this.wordCollections[index];
    return this.wordCollectionLevel;
  }

  public getRandomRound(): Round {
    const randomRound =
      this.wordCollectionLevel.rounds[Math.floor(Math.random() * this.wordCollectionLevel.rounds.length)];
    return randomRound;
  }
}

export const sentenceService = new SentenceService(wordCollectionLevel1);
