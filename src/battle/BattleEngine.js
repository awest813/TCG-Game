export class BattleEngine {
    static createInitialState(playerDeck, opponentDeck, modifiers = []) {
        const shuffle = (array) => [...array].sort(() => Math.random() - 0.5);
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
    static startTurn(state) {
        const newState = JSON.parse(JSON.stringify(state));
        const side = newState.isPlayerTurn ? newState.player : newState.opponent;
        if (newState.turn > 1 || !newState.isPlayerTurn) {
            side.maxMana = Math.min(side.maxMana + 1, 10);
        }
        side.mana = side.maxMana;
        if (side.deck.length > 0) {
            side.hand.push(side.deck.shift());
        }
        else {
            newState.log.push(`${newState.isPlayerTurn ? 'Player' : 'Opponent'} is out of cards!`);
        }
        if (side.active)
            side.active.canEvolve = true;
        side.bench.forEach(b => { if (b)
            b.canEvolve = true; });
        newState.log.push(`${newState.isPlayerTurn ? 'Player' : 'Opponent'} turn ${newState.turn} starts.`);
        return newState;
    }
    static playCard(state, card, sideType) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const newState = JSON.parse(JSON.stringify(state));
        const side = sideType === 'player' ? newState.player : newState.opponent;
        if (side.mana < card.cost) {
            newState.log.push("Not enough energy!");
            return state;
        }
        side.mana -= card.cost;
        const handIndex = side.hand.indexOf(card.id);
        if (handIndex > -1)
            side.hand.splice(handIndex, 1);
        if (card.cardType === 'creature') {
            const entity = {
                id: card.id,
                cardId: card.id,
                instanceId: Math.random().toString(36).substr(2, 9),
                currentHealth: (_a = card.health) !== null && _a !== void 0 ? _a : 0,
                maxHealth: (_b = card.health) !== null && _b !== void 0 ? _b : 0,
                baseMaxHealth: (_c = card.health) !== null && _c !== void 0 ? _c : 0,
                attack: (_d = card.attack) !== null && _d !== void 0 ? _d : 0,
                baseAttack: (_e = card.attack) !== null && _e !== void 0 ? _e : 0,
                hasAttacked: false,
                canEvolve: false
            };
            if (card.evolutionFrom) {
                let target = null;
                if (((_f = side.active) === null || _f === void 0 ? void 0 : _f.cardId) === card.evolutionFrom && side.active.canEvolve) {
                    target = side.active;
                }
                else {
                    const benchMatch = side.bench.find(b => (b === null || b === void 0 ? void 0 : b.cardId) === card.evolutionFrom && b.canEvolve);
                    if (benchMatch)
                        target = benchMatch;
                }
                if (target) {
                    newState.log.push(`${target.cardId} evolved into ${card.name}!`);
                    target.cardId = card.id;
                    target.attack = (_g = card.attack) !== null && _g !== void 0 ? _g : target.attack;
                    target.baseAttack = (_h = card.attack) !== null && _h !== void 0 ? _h : target.baseAttack;
                    target.maxHealth = (_j = card.health) !== null && _j !== void 0 ? _j : target.maxHealth;
                    target.baseMaxHealth = (_k = card.health) !== null && _k !== void 0 ? _k : target.baseMaxHealth;
                    target.currentHealth = Math.min(target.currentHealth + (((_l = card.health) !== null && _l !== void 0 ? _l : target.maxHealth) - target.maxHealth), (_m = card.health) !== null && _m !== void 0 ? _m : target.maxHealth);
                    target.canEvolve = false;
                    return newState;
                }
                else {
                    newState.log.push("Cannot evolve: No valid base creature ready.");
                    return state;
                }
            }
            if (!side.active) {
                side.active = entity;
                newState.log.push(`${card.name} deployed to Active.`);
            }
            else {
                const emptyBenchSlot = side.bench.findIndex(s => s === null);
                if (emptyBenchSlot !== -1) {
                    side.bench[emptyBenchSlot] = entity;
                    newState.log.push(`${card.name} placed on Bench.`);
                }
                else {
                    newState.log.push("Bench is full!");
                    side.mana += card.cost;
                    side.hand.push(card.id);
                    return state;
                }
            }
        }
        else if (card.cardType === 'support' || card.cardType === 'item') {
            newState.log.push(`Used ${card.name}.`);
            if (card.id === 'rooftop-remedy' && side.active) {
                side.active.currentHealth = Math.min(side.active.currentHealth + 3, side.active.maxHealth);
            }
            if (card.id === 'quick-transfer' && side.deck.length > 0) {
                side.hand.push(side.deck.shift());
            }
            if (card.id === 'system-refresh') {
                for (let i = 0; i < 2; i++)
                    if (side.deck.length > 0)
                        side.hand.push(side.deck.shift());
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
    static attack(state, attackerSide) {
        const newState = JSON.parse(JSON.stringify(state));
        const attacker = attackerSide === 'player' ? newState.player : newState.opponent;
        const defender = attackerSide === 'player' ? newState.opponent : newState.player;
        if (!attacker.active || !defender.active) {
            newState.log.push("No target to attack!");
            return state;
        }
        if (attacker.active.hasAttacked)
            return state;
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
            }
            else {
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
    static endTurn(state) {
        const newState = JSON.parse(JSON.stringify(state));
        const resetStats = (entity) => {
            if (!entity)
                return;
            entity.attack = entity.baseAttack;
            entity.maxHealth = entity.baseMaxHealth;
            if (entity.currentHealth > entity.maxHealth)
                entity.currentHealth = entity.maxHealth;
        };
        const side = newState.isPlayerTurn ? newState.player : newState.opponent;
        resetStats(side.active);
        side.bench.forEach(resetStats);
        newState.isPlayerTurn = !newState.isPlayerTurn;
        if (newState.isPlayerTurn)
            newState.turn += 1;
        const nextSide = newState.isPlayerTurn ? newState.player : newState.opponent;
        if (nextSide.active)
            nextSide.active.hasAttacked = false;
        nextSide.bench.forEach(b => { if (b)
            b.hasAttacked = false; });
        return newState;
    }
    static runAI(state, cardPool) {
        let s = this.startTurn(state);
        const supportCards = s.opponent.hand.filter(id => {
            const c = cardPool.find(cp => cp.id === id);
            return ((c === null || c === void 0 ? void 0 : c.cardType) === 'support' || (c === null || c === void 0 ? void 0 : c.cardType) === 'item') && c.cost <= s.opponent.mana;
        });
        supportCards.forEach(id => {
            const c = cardPool.find(cp => cp.id === id);
            s = this.playCard(s, c, 'opponent');
        });
        const playableCreatures = s.opponent.hand.filter(id => {
            const c = cardPool.find(cp => cp.id === id);
            return (c === null || c === void 0 ? void 0 : c.cardType) === 'creature' && c.cost <= s.opponent.mana;
        });
        playableCreatures.forEach(id => {
            const c = cardPool.find(cp => cp.id === id);
            if (!s.opponent.active || s.opponent.bench.some(slot => slot === null)) {
                s = this.playCard(s, c, 'opponent');
            }
        });
        if (s.opponent.active && !s.opponent.active.hasAttacked) {
            s = this.attack(s, 'opponent');
        }
        return this.endTurn(s);
    }
}
