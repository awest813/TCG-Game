// Music & SFX Manager for Neo SF
// Handles BGM transitions and UI audio feedback

export type TrackId = 'TITLE' | 'TOWN' | 'BATTLE' | 'CHAMPION' | 'VICTORY' | 'SHOP';

class AudioManager {
    private currentTrack: HTMLAudioElement | null = null;
    private isMuted = false;

    // Track definitions (mock URLs)
    private tracks: Record<TrackId, string> = {
        TITLE: '/audio/bgm_title.mp3',
        TOWN: '/audio/bgm_club_hub.mp3',
        BATTLE: '/audio/bgm_battle_sync.mp3',
        CHAMPION: '/audio/bgm_last_sync.mp3',
        VICTORY: '/audio/bgm_victory.mp3',
        SHOP: '/audio/bgm_card_boutique.mp3'
    };

    playBGM(id: TrackId) {
        if (this.isMuted) return;
        
        console.log(`[Audio] Transitioning to BGM: ${id}`);
        // In a real implementation, we would fade out currentTrack and fade in new one
        // For now, we log the intent as per the "thinking about it" request
    }

    playSFX(id: string) {
        if (this.isMuted) return;
        console.log(`[Audio] Playing SFX: ${id}`);
    }

    setMute(mute: boolean) {
        this.isMuted = mute;
        if (mute && this.currentTrack) {
            this.currentTrack.pause();
        }
    }
}

export const audioManager = new AudioManager();
