import wordCollectionLevel1 from '../data/wordCollection/wordCollectionLevel1';
import wordCollectionLevel2 from '../data/wordCollection/wordCollectionLevel2';
import wordCollectionLevel3 from '../data/wordCollection/wordCollectionLevel3';
import wordCollectionLevel4 from '../data/wordCollection/wordCollectionLevel4';
import wordCollectionLevel5 from '../data/wordCollection/wordCollectionLevel5';
import wordCollectionLevel6 from '../data/wordCollection/wordCollectionLevel6';
import { WordCollection, Round } from '../types';

const DIFFICULTY_COEFFICIENT = 2;
export class SentenceService {
  private levels: WordCollection[] = [
    wordCollectionLevel1,
    wordCollectionLevel2,
    wordCollectionLevel3,
    wordCollectionLevel4,
    wordCollectionLevel5,
    wordCollectionLevel6,
  ];

  private wordCollectionLevel: WordCollection;

  constructor() {
    this.wordCollectionLevel = this.setWordCollectionLevel(1);
  }

  public setWordCollectionLevel(level: number): WordCollection {
    const index = level;
    this.wordCollectionLevel = this.levels[index];
    return this.wordCollectionLevel;
  }

  public getRandomRound(): Round {
    const randomRound =
      this.wordCollectionLevel.rounds[Math.floor(Math.random() * this.wordCollectionLevel.rounds.length)];
    return randomRound;
  }

  public getRounds(level: number): Round[] {
    const roundsNumber = Math.trunc(3 + level * DIFFICULTY_COEFFICIENT);
    const rounds = [];
    for (let i = 0; i < roundsNumber; i += 1) {
      rounds.push(this.getRandomRound());
    }
    return rounds;
  }
}

export const sentenceService = new SentenceService();
