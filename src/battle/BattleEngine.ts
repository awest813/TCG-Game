import { Card, CreatureCard, SupportCard, BattleModifier } from "../core/types";

export interface BattleEntity {
  id: string;
  cardId: string;
  instanceId: string;
  currentHealth: number;
  maxHealth: number;
  baseMaxHealth: number;
  attack: number;
  baseAttack: number;
  hasAttacked: boolean;
  canEvolve: boolean;
  isAsleep?: boolean;
}

export interface BattleSide {
  active: BattleEntity | null;
  bench: (BattleEntity | null)[];
  hand: string[];
  deck: string[];
  mana: number;
  maxMana: number;
  prizes: number;
}

export interface BattleState {
  player: BattleSide;
  opponent: BattleSide;
  turn: number;
  isPlayerTurn: boolean;
  phase: "START" | "MAIN" | "BATTLE" | "END";
  log: string[];
  winner?: 'player' | 'opponent';
  modifiers: BattleModifier[];
  field?: string | null;
}

export class BattleEngine {
  static createInitialState(playerDeck: string[], opponentDeck: string[], modifiers: BattleModifier[] = []): BattleState {
    const shuffle = (array: string[]) => [...array].sort(() => Math.random() - 0.5);
    const pDeck = shuffle(playerDeck);
    const oDeck = shuffle(opponentDeck);

    const playerManaBonus = modifiers.filter(m => m.type === "MANA_START").reduce((acc, m) => acc + m.value, 0);

    return {
      player: {
        active: null,
        bench: [null, null],
        hand: pDeck.splice(0, 5),
        deck: pDeck,
        mana: 1 + playerManaBonus,
        maxMana: 1 + playerManaBonus,
        prizes: 0
      },
      opponent: {
        active: null,
        bench: [null, null],
        hand: oDeck.splice(0, 5),
        deck: oDeck,
        mana: 1,
        maxMana: 1,
        prizes: 0
      },
      turn: 1,
      isPlayerTurn: true,
      phase: "MAIN",
      log: ["Battle started!"],
      modifiers: modifiers
    };
  }

  static startTurn(state: BattleState): BattleState {
    const newState = JSON.parse(JSON.stringify(state)) as BattleState;
    const side = newState.isPlayerTurn ? newState.player : newState.opponent;

    if (newState.turn > 1 || !newState.isPlayerTurn) {
        side.maxMana = Math.min(side.maxMana + 1, 10);
    }
    side.mana = side.maxMana;

    if (side.deck.length > 0) {
      side.hand.push(side.deck.shift()!);
    } else {
        newState.log.push(`${newState.isPlayerTurn ? 'Player' : 'Opponent'} is out of cards!`);
    }

    if (side.active) side.active.canEvolve = true;
    side.bench.forEach(b => { if (b) b.canEvolve = true; });

    newState.log.push(`${newState.isPlayerTurn ? 'Player' : 'Opponent'} turn ${newState.turn} starts.`);
    return newState;
  }

  static playCard(state: BattleState, card: Card, sideType: 'player' | 'opponent'): BattleState {
    const newState = JSON.parse(JSON.stringify(state)) as BattleState;
    const side = sideType === 'player' ? newState.player : newState.opponent;

    if (side.mana < card.cost) {
      newState.log.push("Not enough energy!");
      return state;
    }

    side.mana -= card.cost;
    const handIndex = side.hand.indexOf(card.id);
    if (handIndex > -1) side.hand.splice(handIndex, 1);

    if (card.cardType === 'creature') {
        const entity: BattleEntity = {
            id: card.id,
            cardId: card.id,
            instanceId: Math.random().toString(36).substr(2, 9),
            currentHealth: card.health ?? 0,
            maxHealth: card.health ?? 0,
            baseMaxHealth: card.health ?? 0,
            attack: card.attack ?? 0,
            baseAttack: card.attack ?? 0,
            hasAttacked: false,
            canEvolve: false
        };

        if (card.evolutionFrom) {
            // Check if we can evolve
            let target: BattleEntity | null = null;
            if (side.active?.cardId === card.evolutionFrom && side.active.canEvolve) {
                target = side.active;
            } else {
                const benchMatch = side.bench.find(b => b?.cardId === card.evolutionFrom && b.canEvolve);
                if (benchMatch) target = benchMatch;
            }

            if (target) {
                newState.log.push(`${target.cardId} evolved into ${card.name}!`);
                target.cardId = card.id;
                target.attack = card.attack ?? target.attack;
                target.baseAttack = card.attack ?? target.baseAttack;
                target.maxHealth = card.health ?? target.maxHealth;
                target.baseMaxHealth = card.health ?? target.baseMaxHealth;
                target.currentHealth = Math.min(target.currentHealth + ((card.health ?? target.maxHealth) - target.maxHealth), card.health ?? target.maxHealth);
                target.canEvolve = false;
                return newState;
            } else {
                newState.log.push("Cannot evolve: No valid base creature ready.");
                return state;
            }
        }

        if (!side.active) {
            side.active = entity;
            newState.log.push(`${card.name} deployed to Active.`);
        } else {
            const emptyBenchSlot = side.bench.findIndex(s => s === null);
            if (emptyBenchSlot !== -1) {
                side.bench[emptyBenchSlot] = entity;
                newState.log.push(`${card.name} placed on Bench.`);
            } else {
                newState.log.push("Bench is full!");
                side.mana += card.cost;
                side.hand.push(card.id);
                return state;
            }
        }
    } else if (card.cardType === 'support' || card.cardType === 'item') {
        newState.log.push(`Used ${card.name}.`);
        // Basic effect handling
        if (card.id === 'rooftop-remedy' && side.active) {
            side.active.currentHealth = Math.min(side.active.currentHealth + 3, side.active.maxHealth);
        }
        if (card.id === 'quick-transfer' && side.deck.length > 0) {
            side.hand.push(side.deck.shift()!);
        }
        if (card.id === 'system-refresh') {
            for (let i = 0; i < 2; i++) if (side.deck.length > 0) side.hand.push(side.deck.shift()!);
        }
        if (card.id === 'signal-boost' && side.active) {
            side.active.attack += 2;
        }
        if (card.id === 'overclock' && side.active) {
            side.active.hasAttacked = false;
        }
    }

    return newState;
  }

  static attack(state: BattleState, attackerSide: 'player' | 'opponent'): BattleState {
    const newState = JSON.parse(JSON.stringify(state)) as BattleState;
    const attacker = attackerSide === 'player' ? newState.player : newState.opponent;
    const defender = attackerSide === 'player' ? newState.opponent : newState.player;

    if (!attacker.active || !defender.active) {
        newState.log.push("No target to attack!");
        return state;
    }
    if (attacker.active.hasAttacked) return state;

    defender.active.currentHealth -= attacker.active.attack;
    attacker.active.hasAttacked = true;

    newState.log.push(`${attackerSide === 'player' ? 'You' : 'Opponent'} attack for ${attacker.active.attack}.`);

    if (defender.active.currentHealth <= 0) {
      newState.log.push(`${attackerSide === 'player' ? 'Opponent' : 'Player'} unit KO'd!`);
      defender.active = null;
      attacker.prizes += 1;
      
      if (attacker.prizes >= 3) {
          newState.winner = attackerSide;
          newState.log.push(`Match complete: ${attackerSide} wins!`);
      } else {
          // Auto-promote
          const benchIndex = defender.bench.findIndex(b => b !== null);
          if (benchIndex !== -1) {
            defender.active = defender.bench[benchIndex];
            defender.bench[benchIndex] = null;
            newState.log.push("Replacement unit promoted from bench.");
          }
      }
    }

    return newState;
  }

  static endTurn(state: BattleState): BattleState {
    const newState = JSON.parse(JSON.stringify(state)) as BattleState;
    
    // Reset temporary stats
    const resetStats = (entity: BattleEntity | null) => {
        if (!entity) return;
        entity.attack = entity.baseAttack;
        entity.maxHealth = entity.baseMaxHealth;
        if (entity.currentHealth > entity.maxHealth) entity.currentHealth = entity.maxHealth;
    };

    const side = newState.isPlayerTurn ? newState.player : newState.opponent;
    resetStats(side.active);
    side.bench.forEach(resetStats);

    newState.isPlayerTurn = !newState.isPlayerTurn;
    if (newState.isPlayerTurn) newState.turn += 1;

    const nextSide = newState.isPlayerTurn ? newState.player : newState.opponent;
    if (nextSide.active) nextSide.active.hasAttacked = false;
    nextSide.bench.forEach(b => { if (b) b.hasAttacked = false; });
    
    return newState;
  }

  // Phase 1 Heuristic AI
  static runAI(state: BattleState, cardPool: Card[]): BattleState {
      let s = this.startTurn(state);
      
      // 1. Play support/item cards first if they give value
      const supportCards = s.opponent.hand.filter(id => {
          const c = cardPool.find(cp => cp.id === id);
          return (c?.cardType === 'support' || c?.cardType === 'item') && c.cost <= s.opponent.mana;
      });

      supportCards.forEach(id => {
          const c = cardPool.find(cp => cp.id === id)!;
          s = this.playCard(s, c, 'opponent');
      });

      // 2. Play creatures if active is empty or bench has room
      const playableCreatures = s.opponent.hand.filter(id => {
          const c = cardPool.find(cp => cp.id === id);
          return c?.cardType === 'creature' && c.cost <= s.opponent.mana;
      });

      playableCreatures.forEach(id => {
          const c = cardPool.find(cp => cp.id === id)!;
          if (!s.opponent.active || s.opponent.bench.some(slot => slot === null)) {
              s = this.playCard(s, c, 'opponent');
          }
      });

      // 3. Attack if active exists
      if (s.opponent.active && !s.opponent.active.hasAttacked) {
          s = this.attack(s, 'opponent');
      }

      return this.endTurn(s);
  }
}
