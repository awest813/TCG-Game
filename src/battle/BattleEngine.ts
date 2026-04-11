import { BattleModifier, Card } from '../core/types';
import { CARD_POOL } from '../data/cards';

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
  phase: 'START' | 'MAIN' | 'BATTLE' | 'END';
  log: string[];
  winner?: 'player' | 'opponent';
  modifiers: BattleModifier[];
  field?: string | null;
}

type CardPoolHost = typeof globalThis & { __cardPool?: Card[] };

export class BattleEngine {
  static createInitialState(playerDeck: string[], opponentDeck: string[], modifiers: BattleModifier[] = []): BattleState {
    const shuffle = (array: string[]) => [...array].sort(() => Math.random() - 0.5);
    const pDeck = shuffle(playerDeck);
    const oDeck = shuffle(opponentDeck);
    const playerManaBonus = modifiers.filter((modifier) => modifier.type === 'MANA_START').reduce((acc, modifier) => acc + modifier.value, 0);

    const state: BattleState = {
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
      phase: 'MAIN',
      log: ['Battle started!'],
      modifiers,
      field: null
    };

    this.autoDeployOpeningCreatures(state, 'player');
    this.autoDeployOpeningCreatures(state, 'opponent');
    state.log.push('Opening sync creatures deployed.');
    return state;
  }

  private static autoDeployOpeningCreatures(state: BattleState, sideType: 'player' | 'opponent') {
    const side = sideType === 'player' ? state.player : state.opponent;
    const openingCreatures = side.hand
      .map((id) => ({ id, card: this.getCardFromState(state, id) }))
      .filter((entry) => entry.card?.cardType === 'creature' && !entry.card.evolutionFrom)
      .slice(0, 3);

    openingCreatures.forEach((entry, index) => {
      if (!entry.card) return;
      const entity = this.createEntity(entry.card);
      const handIndex = side.hand.indexOf(entry.id);
      if (handIndex !== -1) side.hand.splice(handIndex, 1);

      if (index === 0 && !side.active) {
        side.active = entity;
      } else {
        const benchSlot = side.bench.findIndex((slot) => slot === null);
        if (benchSlot !== -1) side.bench[benchSlot] = entity;
      }
    });
  }

  private static getCardFromState(state: BattleState, id: string): Card | undefined {
    const pool = (globalThis as CardPoolHost).__cardPool ?? CARD_POOL;
    void state;
    return pool.find((card) => card.id === id);
  }

  private static createEntity(card: Card): BattleEntity {
    const primaryAttack = card.attacks?.[0]?.damage ?? card.attack ?? 0;
    return {
      id: card.id,
      cardId: card.id,
      instanceId: Math.random().toString(36).slice(2, 11),
      currentHealth: card.health ?? 0,
      maxHealth: card.health ?? 0,
      baseMaxHealth: card.health ?? 0,
      attack: primaryAttack,
      baseAttack: primaryAttack,
      hasAttacked: false,
      canEvolve: false
    };
  }

  private static activeSide(state: BattleState) {
    return state.isPlayerTurn ? state.player : state.opponent;
  }

  private static opposingSide(state: BattleState) {
    return state.isPlayerTurn ? state.opponent : state.player;
  }

  private static drawCards(side: BattleSide, count: number) {
    for (let i = 0; i < count; i += 1) {
      if (side.deck.length > 0) {
        side.hand.push(side.deck.shift()!);
      }
    }
  }

  private static findBestBenchTarget(side: BattleSide) {
    const occupiedBench = side.bench.filter((entity): entity is BattleEntity => entity !== null);
    return occupiedBench.sort((a, b) => (a.currentHealth / a.maxHealth) - (b.currentHealth / b.maxHealth))[0] ?? null;
  }

  private static applyFieldModifiers(state: BattleState) {
    const applyToEntity = (entity: BattleEntity | null) => {
      if (!entity) return;
      entity.attack = entity.baseAttack;
      entity.maxHealth = entity.baseMaxHealth;

      const card = this.getCardFromState(state, entity.cardId);
      if (!card?.creatureType) return;

      if (state.field === 'neon-grid' && card.creatureType === 'Pulse') entity.attack += 1;
      if (state.field === 'garden-haze' && card.creatureType === 'Bloom') {
        entity.maxHealth += 2;
        entity.currentHealth += 2;
      }
      if (state.field === 'alloy-foundry' && card.creatureType === 'Alloy') entity.maxHealth += 2;
      if (state.field === 'void-rift') entity.attack += 1;
    };

    [state.player.active, ...state.player.bench, state.opponent.active, ...state.opponent.bench].forEach((entity) => applyToEntity(entity));
  }

  static startTurn(state: BattleState): BattleState {
    const newState = JSON.parse(JSON.stringify(state)) as BattleState;
    const side = this.activeSide(newState);

    if (newState.turn > 1 || !newState.isPlayerTurn) {
      side.maxMana = Math.min(side.maxMana + 1, 10);
    }
    side.mana = side.maxMana;
    this.drawCards(side, 1);

    if (side.active) side.active.canEvolve = true;
    side.bench.forEach((entity) => {
      if (entity) entity.canEvolve = true;
    });

    if (!side.active) {
      const benchIndex = side.bench.findIndex((entity) => entity !== null);
      if (benchIndex !== -1) {
        side.active = side.bench[benchIndex];
        side.bench[benchIndex] = null;
      }
    }

    this.applyFieldModifiers(newState);
    newState.log.push(`${newState.isPlayerTurn ? 'Player' : 'Opponent'} turn ${newState.turn} starts.`);
    return newState;
  }

  private static resolveTargetSide(state: BattleState, sideType: 'player' | 'opponent') {
    return sideType === 'player' ? state.player : state.opponent;
  }

  private static resolveEnemySide(state: BattleState, sideType: 'player' | 'opponent') {
    return sideType === 'player' ? state.opponent : state.player;
  }

  private static applyCardEffects(state: BattleState, card: Card, sideType: 'player' | 'opponent') {
    const side = this.resolveTargetSide(state, sideType);
    const enemy = this.resolveEnemySide(state, sideType);
    const effects = [...(card.onPlayEffects ?? []), ...(card.effect ?? [])];

    effects.forEach((effect) => {
      switch (effect.type) {
        case 'draw':
          this.drawCards(side, effect.value ?? 1);
          break;
        case 'heal':
          if (effect.target === 'bench') {
            const target = this.findBestBenchTarget(side);
            if (target) target.currentHealth = Math.min(target.maxHealth, target.currentHealth + (effect.value ?? 0));
          } else if (side.active) {
            side.active.currentHealth = Math.min(side.active.maxHealth, side.active.currentHealth + (effect.value ?? 0));
          }
          break;
        case 'damage':
          if (enemy.active) enemy.active.currentHealth -= effect.value ?? 0;
          break;
        case 'buff':
          if (side.active) side.active.attack += effect.value ?? 0;
          break;
        default:
          break;
      }
    });

    if (card.cardType === 'field') {
      state.field = card.id;
      state.log.push(`${card.name} rewired the arena.`);
      this.applyFieldModifiers(state);
    }

    if (card.id === 'power-cell') side.mana += 1;
    if (card.id === 'overclock' && side.active) side.active.hasAttacked = false;
    if (card.id === 'stim-patch' && side.active) side.active.isAsleep = false;
  }

  static playCard(state: BattleState, card: Card, sideType: 'player' | 'opponent'): BattleState {
    const newState = JSON.parse(JSON.stringify(state)) as BattleState;
    const side = this.resolveTargetSide(newState, sideType);

    if (side.mana < card.cost) {
      newState.log.push('Not enough energy!');
      return state;
    }

    side.mana -= card.cost;
    const handIndex = side.hand.indexOf(card.id);
    if (handIndex > -1) side.hand.splice(handIndex, 1);

    if (card.cardType === 'creature') {
      if (card.evolutionFrom) {
        let target: BattleEntity | null = null;
        if (side.active?.cardId === card.evolutionFrom && side.active.canEvolve) {
          target = side.active;
        } else {
          target = side.bench.find((entity) => entity?.cardId === card.evolutionFrom && entity.canEvolve) ?? null;
        }

        if (!target) {
          newState.log.push('Cannot evolve: no valid base creature ready.');
          side.mana += card.cost;
          side.hand.push(card.id);
          return state;
        }

        const previousMaxHealth = target.maxHealth;
        target.cardId = card.id;
        target.attack = card.attack ?? target.attack;
        target.baseAttack = card.attack ?? target.baseAttack;
        target.maxHealth = card.health ?? target.maxHealth;
        target.baseMaxHealth = card.health ?? target.baseMaxHealth;
        target.currentHealth = Math.min(target.currentHealth + (target.maxHealth - previousMaxHealth), target.maxHealth);
        target.canEvolve = false;
        newState.log.push(`${card.name} evolved onto the field.`);
        this.applyCardEffects(newState, card, sideType);
        return newState;
      }

      const entity = this.createEntity(card);
      if (!side.active) {
        side.active = entity;
        newState.log.push(`${card.name} deployed to Active.`);
      } else {
        const emptyBenchSlot = side.bench.findIndex((slot) => slot === null);
        if (emptyBenchSlot === -1) {
          newState.log.push('Bench is full!');
          side.mana += card.cost;
          side.hand.push(card.id);
          return state;
        }
        side.bench[emptyBenchSlot] = entity;
        newState.log.push(`${card.name} placed on Bench.`);
      }

      this.applyCardEffects(newState, card, sideType);
      return newState;
    }

    newState.log.push(`Used ${card.name}.`);
    this.applyCardEffects(newState, card, sideType);
    return newState;
  }

  static attack(state: BattleState, attackerSide: 'player' | 'opponent'): BattleState {
    const newState = JSON.parse(JSON.stringify(state)) as BattleState;
    const attacker = attackerSide === 'player' ? newState.player : newState.opponent;
    const defender = attackerSide === 'player' ? newState.opponent : newState.player;

    if (!attacker.active || !defender.active) {
      newState.log.push('No target to attack!');
      return state;
    }
    if (attacker.active.hasAttacked) return state;

    const attackerCard = this.getCardFromState(newState, attacker.active.cardId);
    const defenderCard = this.getCardFromState(newState, defender.active.cardId);

    let damage = attacker.active.attack;
    const isWeakness = defenderCard?.weakness && attackerCard?.creatureType && defenderCard.weakness === attackerCard.creatureType;
    if (isWeakness) {
      damage += 10;
      newState.log.push(`Weakness! +10 bonus damage.`);
    }

    defender.active.currentHealth -= damage;
    attacker.active.hasAttacked = true;
    newState.log.push(`${attackerSide === 'player' ? 'You' : 'Opponent'} attack for ${damage}${isWeakness ? ' (weakness)' : ''}.`);

    if (defender.active.currentHealth <= 0) {
      newState.log.push(`${attackerSide === 'player' ? 'Opponent' : 'Player'} unit KO'd!`);
      defender.active = null;
      attacker.prizes += 1;

      if (attacker.prizes >= 3) {
        newState.winner = attackerSide;
        newState.log.push(`Match complete: ${attackerSide} wins!`);
      } else {
        const benchIndex = defender.bench.findIndex((entity) => entity !== null);
        if (benchIndex !== -1) {
          defender.active = defender.bench[benchIndex];
          defender.bench[benchIndex] = null;
          newState.log.push('Replacement unit promoted from bench.');
        }
      }
    }

    return newState;
  }

  static endTurn(state: BattleState): BattleState {
    const newState = JSON.parse(JSON.stringify(state)) as BattleState;
    const endingSide = this.activeSide(newState);

    if (newState.field === 'void-rift') {
      if (newState.player.hand.length > 0) newState.player.hand.pop();
      if (newState.opponent.hand.length > 0) newState.opponent.hand.pop();
      newState.log.push('Void Rift forces both sides to discard.');
    }

    const resetStats = (entity: BattleEntity | null) => {
      if (!entity) return;
      entity.attack = entity.baseAttack;
      entity.maxHealth = entity.baseMaxHealth;
      if (entity.currentHealth > entity.maxHealth) entity.currentHealth = entity.maxHealth;
    };

    resetStats(endingSide.active);
    endingSide.bench.forEach(resetStats);

    newState.isPlayerTurn = !newState.isPlayerTurn;
    if (newState.isPlayerTurn) newState.turn += 1;

    const nextSide = this.activeSide(newState);
    if (nextSide.active) nextSide.active.hasAttacked = false;
    nextSide.bench.forEach((entity) => {
      if (entity) entity.hasAttacked = false;
    });

    return this.startTurn(newState);
  }

  static runAI(state: BattleState, cardPool: Card[]): BattleState {
    (globalThis as CardPoolHost).__cardPool = cardPool;
    let working = JSON.parse(JSON.stringify(state)) as BattleState;

    const supportCards = working.opponent.hand.filter((id) => {
      const card = cardPool.find((entry) => entry.id === id);
      return !!card && card.cardType !== 'creature' && card.cost <= working.opponent.mana;
    });

    supportCards.forEach((id) => {
      const card = cardPool.find((entry) => entry.id === id);
      if (card) working = this.playCard(working, card, 'opponent');
    });

    const playableCreatures = working.opponent.hand
      .map((id) => cardPool.find((entry) => entry.id === id))
      .filter((card): card is Card => !!card && card.cardType === 'creature' && card.cost <= working.opponent.mana)
      .sort((a, b) => (b.attack ?? 0) - (a.attack ?? 0));

    playableCreatures.forEach((card) => {
      if (!working.opponent.active || working.opponent.bench.some((slot) => slot === null)) {
        working = this.playCard(working, card, 'opponent');
      }
    });

    if (working.opponent.active && !working.opponent.active.hasAttacked) {
      working = this.attack(working, 'opponent');
    }

    return this.endTurn(working);
  }
}
