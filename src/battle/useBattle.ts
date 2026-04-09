import { useState, useCallback, useEffect } from 'react';
import { BattleState, BattleEngine } from './BattleEngine';
import { CARD_POOL } from '../data/cards';
import { BattleModifier } from '../core/types';

export const useBattle = (pDeck: string[], oDeck: string[], modifiers: BattleModifier[] = []) => {
  const [battleState, setBattleState] = useState<BattleState>(
    BattleEngine.createInitialState(pDeck, oDeck, modifiers)
  );

  const playCard = useCallback((cardId: string) => {
    const card = CARD_POOL.find(c => c.id === cardId);
    if (!card) return;
    setBattleState(prev => BattleEngine.playCard(prev, card, 'player'));
  }, []);

  const attack = useCallback(() => {
    setBattleState(prev => BattleEngine.attack(prev, 'player'));
  }, []);

  const endTurn = useCallback(() => {
    if (!battleState.isPlayerTurn || battleState.winner) return;

    setBattleState(prev => BattleEngine.endTurn(prev));
  }, [battleState.isPlayerTurn, battleState.winner]);

  // AI Turn Trigger
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
