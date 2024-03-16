import { Round, RoundSentence } from '../../../types';

export const getSentencesFromRound = (round: Round): RoundSentence[] => {
  return round.words;
};

export const getSentence = (sentence: RoundSentence): string => {
  return sentence.word;
};
