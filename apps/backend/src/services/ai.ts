import {CARD_ADVANTAGES, type Card, type CardType } from '../types/card';
import logger from '../utils/logger';

// Crypto-themed AI names
const AI_NAMES = ['Satoshi', 'Vitalik', 'CZ', 'Hayden', 'Brian', 'Andre', 'Do Kwon', 'SBF'];

export class AIService {
  /**
   * Get random AI name
   */
  getRandomAIName(): string {
    return AI_NAMES[Math.floor(Math.random() * AI_NAMES.length)];
  }

  /**
   * Generate AI wallet address based on name
   */
  generateAIAddress(aiName: string): string {
    // Generate deterministic but unique-looking address from AI name
    const hash = Buffer.from(aiName).toString('hex').padEnd(40, '0');
    return `0x${hash.substring(0, 40)}`;
  }

  /**
   * Select card using basic strategy
   * Strategy:
   * 1. Try to counter opponent's last card with type advantage
   * 2. Prefer higher values (7 > 5 > 3)
   * 3. Add some randomness to make it less predictable
   */
  selectCard(
    hand: Card[],
    opponentLastCard?: Card,
    currentScore?: {ai: number; player: number}
  ): Card {
    if (hand.length === 0) {
      throw new Error('AI has no cards to select');
    }

    logger.debug('AI selecting card', {
      handSize: hand.length,
      opponentLastCard: opponentLastCard
        ? `${opponentLastCard.type}_${opponentLastCard.value}`
        : 'none',
      score: currentScore,
    });

    // Strategy 1: If opponent played a card last round, try to counter
    if (opponentLastCard) {
      const counterType = this.getCounterType(opponentLastCard.type);
      const counterCards = hand.filter((c) => c.type === counterType);

      if (counterCards.length > 0) {
        // Prefer higher value counter cards
        const sortedCounters = counterCards.sort((a, b) => b.value - a.value);

        // 70% chance to use counter strategy
        if (Math.random() < 0.7) {
          logger.debug('AI using counter strategy', {
            selectedCard: `${sortedCounters[0].type}_${sortedCounters[0].value}`,
          });
          return sortedCounters[0];
        }
      }
    }

    // Strategy 2: If losing significantly, play aggressively (higher values)
    if (currentScore && currentScore.player - currentScore.ai >= 2) {
      const sortedByValue = [...hand].sort((a, b) => b.value - a.value);

      // 60% chance to play highest value card when behind
      if (Math.random() < 0.6) {
        logger.debug('AI playing aggressively (behind)', {
          selectedCard: `${sortedByValue[0].type}_${sortedByValue[0].value}`,
        });
        return sortedByValue[0];
      }
    }

    // Strategy 3: Balanced approach - prefer higher values with some randomness
    const weights: {[key: number]: number} = {
      7: 5, // 5x more likely
      5: 3, // 3x more likely
      3: 1, // 1x (base)
    };

    const weightedCards = hand.flatMap((card) => Array(weights[card.value] || 1).fill(card));

    const selected = weightedCards[Math.floor(Math.random() * weightedCards.length)];

    logger.debug('AI using balanced strategy', {
      selectedCard: `${selected.type}_${selected.value}`,
    });

    return selected;
  }

  /**
   * Get counter type for a given card type
   */
  private getCounterType(type: CardType): CardType | null {
    // Find which type beats the given type
    // CARD_ADVANTAGES maps: fire -> ice, ice -> water, water -> fire
    for (const [attackerType, defeatedType] of Object.entries(CARD_ADVANTAGES)) {
      if (defeatedType === type) {
        return attackerType as CardType;
      }
    }
    return null;
  }

  /**
   * Get delay before AI makes a selection (simulates thinking)
   * Returns delay in milliseconds
   */
  getSelectionDelay(): number {
    // Random delay between 1.5 and 3.5 seconds
    return 1500 + Math.random() * 2000;
  }
}

export default new AIService();
