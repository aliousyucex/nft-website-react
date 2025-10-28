export type CardType = 'fire' | 'ice' | 'water';
export type CardValue = 3 | 5 | 7;

export interface Card {
  type: CardType;
  value: CardValue;
  id: string; // e.g., "fire_5"
}

export interface Deck {
  inHand: Card[];
  remaining: Card[];
  used: Card[];
}

export const CARD_ADVANTAGES: Record<CardType, CardType> = {
  fire: 'ice',
  water: 'fire',
  ice: 'water',
};

export const createFullDeck = (): Card[] => {
  const types: CardType[] = ['fire', 'ice', 'water'];
  const values: CardValue[] = [3, 5, 7];
  const deck: Card[] = [];

  types.forEach((type) => {
    values.forEach((value) => {
      deck.push({
        type,
        value,
        id: `${type}_${value}`,
      });
    });
  });

  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const dealCards = (deck: Card[]): { hand: Card[]; remaining: Card[] } => {
  const shuffled = shuffleDeck(deck);
  return {
    hand: shuffled.slice(0, 5),
    remaining: shuffled.slice(5),
  };
};

