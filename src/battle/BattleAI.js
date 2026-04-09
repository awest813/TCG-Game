export class BattleAI {
    static evaluatePlay(hand, currentSync, field, opponentField) {
        void field;
        void opponentField;
        const playable = hand.filter(c => c.cost <= currentSync);
        if (playable.length === 0)
            return null;
        playable.sort((a, b) => { var _a, _b; return ((_a = b.attack) !== null && _a !== void 0 ? _a : 0) - ((_b = a.attack) !== null && _b !== void 0 ? _b : 0); });
        return playable[0];
    }
    static getTurnAction(hand, currentSync, field, opponentField) {
        const cardToPlay = this.evaluatePlay(hand, currentSync, field, opponentField);
        return {
            type: 'PLAY_CARD',
            card: cardToPlay
        };
    }
}
