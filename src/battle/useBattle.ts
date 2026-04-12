import { useState, useCallback, useEffect } from 'react';
import { BattleState, BattleEngine } from './BattleEngine';
import { CARD_POOL } from '../data/cards';
import { BattleModifier } from '../core/types';

export const useBattle = (pDeck: string[], oDeck: string[], modifiers: BattleModifier[] = []) => {
  const [battleState, setBattleState] = useState<BattleState>(
    BattleEngine.createInitialState(pDeck, oDeck, modifiers)
  );
  const [aiPending, setAiPending] = useState(false);

  useEffect(() => {
    setBattleState(BattleEngine.createInitialState(pDeck, oDeck, modifiers));
    setAiPending(false);
  }, [modifiers, oDeck, pDeck]);

  const playCard = useCallback((cardId: string) => {
    if (!battleState.isPlayerTurn || battleState.winner) return;
    const card = CARD_POOL.find(c => c.id === cardId);
    if (!card) return;
    setBattleState(prev => BattleEngine.playCard(prev, card, 'player'));
  }, [battleState.isPlayerTurn, battleState.winner]);

  const attack = useCallback(() => {
    if (!battleState.isPlayerTurn || battleState.winner) return;
    setBattleState(prev => BattleEngine.attack(prev, 'player'));
  }, [battleState.isPlayerTurn, battleState.winner]);

  const endTurn = useCallback(() => {
    if (!battleState.isPlayerTurn || battleState.winner) return;
    setBattleState(prev => BattleEngine.endTurn(prev));
  }, [battleState.isPlayerTurn, battleState.winner]);

  // AI Turn Trigger
  useEffect(() => {
    if (!battleState.isPlayerTurn && !battleState.winner) {
      setAiPending(true);
      const timer = setTimeout(() => {
        setAiPending(false);
        setBattleState(prev => BattleEngine.runAI(prev, CARD_POOL));
      }, 1200);
      return () => {
        setAiPending(false);
        clearTimeout(timer);
      };
    }
    setAiPending(false);
    return undefined;
  }, [battleState.isPlayerTurn, battleState.winner]);

  return { battleState, playCard, attack, endTurn, aiPending };
};
