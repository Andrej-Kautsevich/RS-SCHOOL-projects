import Card from '../../../models/Card';
import { Round, RoundSentence } from '../../../types';

export const getSentencesFromRound = (round: Round): RoundSentence[] => {
  return round.words;
};

export const getSentence = (sentence: RoundSentence): string => {
  return sentence.word;
};

export const handleDragStart = (card: Card, event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', card.getNode().id);
  }
};

export const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

export const handleDrop = (event: DragEvent, dropCard: (cardId: string) => void) => {
  event.preventDefault();
  if (event.dataTransfer) {
    const cardId = event.dataTransfer.getData('text/plain');
    dropCard(cardId);
  }
};
