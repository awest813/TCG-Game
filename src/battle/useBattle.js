import { useState, useCallback, useEffect } from 'react';
import { BattleEngine } from './BattleEngine';
import { CARD_POOL } from '../data/cards';
export const useBattle = (pDeck, oDeck, modifiers = []) => {
    const [battleState, setBattleState] = useState(BattleEngine.createInitialState(pDeck, oDeck, modifiers));
    const playCard = useCallback((cardId) => {
        const card = CARD_POOL.find(c => c.id === cardId);
        if (!card)
            return;
        setBattleState(prev => BattleEngine.playCard(prev, card, 'player'));
    }, []);
    const attack = useCallback(() => {
        setBattleState(prev => BattleEngine.attack(prev, 'player'));
    }, []);
    const endTurn = useCallback(() => {
        if (!battleState.isPlayerTurn || battleState.winner)
            return;
        setBattleState(prev => BattleEngine.endTurn(prev));
    }, [battleState.isPlayerTurn, battleState.winner]);
    useEffect(() => {
        if (!battleState.isPlayerTurn && !battleState.winner) {
            const timer = setTimeout(() => {
                setBattleState(prev => BattleEngine.runAI(prev, CARD_POOL));
            }, 1500);
            return () => clearTimeout(timer);
        }
        return undefined;
    }, [battleState.isPlayerTurn, battleState.winner]);
    return { battleState, playCard, attack, endTurn };
};
