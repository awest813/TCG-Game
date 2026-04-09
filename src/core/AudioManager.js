class AudioManager {
    constructor() {
        Object.defineProperty(this, "currentTrack", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "isMuted", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "tracks", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: {
                TITLE: '/audio/bgm_title.mp3',
                TOWN: '/audio/bgm_club_hub.mp3',
                BATTLE: '/audio/bgm_battle_sync.mp3',
                CHAMPION: '/audio/bgm_last_sync.mp3',
                VICTORY: '/audio/bgm_victory.mp3',
                SHOP: '/audio/bgm_card_boutique.mp3'
            }
        });
    }
    playBGM(id) {
        if (this.isMuted)
            return;
        console.log(`[Audio] Transitioning to BGM: ${id}`);
    }
    playSFX(id) {
        if (this.isMuted)
            return;
        console.log(`[Audio] Playing SFX: ${id}`);
    }
    setMute(mute) {
        this.isMuted = mute;
        if (mute && this.currentTrack) {
            this.currentTrack.pause();
        }
    }
}
export const audioManager = new AudioManager();
