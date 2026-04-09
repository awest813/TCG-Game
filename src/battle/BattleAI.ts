import { Card, GameState } from '../core/types';

/**
 * Simple AI for Neo SF Battle Circuit
 * Higher 'Rank' opponents use more aggressive logic.
 */
export class BattleAI {
    static evaluatePlay(hand: Card[], currentSync: number, field: Card[], opponentField: Card[]): Card | null {
        // 1. Can we play anything?
        const playable = hand.filter(c => c.cost <= currentSync);
        if (playable.length === 0) return null;

        // 2. Simple Logic: Play high attack units first if board is empty
        // Or play defense if opponent has more units
        playable.sort((a, b) => b.attack - a.attack);

        // For now, AI just plays the strongest card it can afford
        return playable[0];
    }

    static getTurnAction(hand: Card[], currentSync: number, field: Card[], opponentField: Card[]) {
        const cardToPlay = this.evaluatePlay(hand, currentSync, field, opponentField);
        
        return {
            type: 'PLAY_CARD',
            card: cardToPlay
        };
    }
}
