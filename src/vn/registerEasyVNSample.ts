import { Character, registerScene, startScene, waitClick } from 'easyvn';

let registered = false;

/**
 * Registers a tiny demo scene for the EasyVN DOM bridge (see EasyVNHost).
 * Safe to call multiple times — registers once.
 */
export function registerEasyVNSampleScenes(): void {
  if (registered) return;
  registered = true;

  registerScene(
    'easyvn-welcome',
    async () => {
      const lucy = new Character('Lucy', {
        sprites: { default: 'lucy.svg' },
        defaultSprite: 'default'
      });
      lucy.appear({ orientation: 'center' });
      lucy.talk('EasyVN is running inside our shell — same DOM hooks as upstream (#speaker, #dialogue, #textbox).');
      await waitClick();
      lucy.talk('Monogatari’s lesson applies here too: your VN is a web page — compose it with normal HTML/CSS.');
      await waitClick();
    },
    { background: 'demo.svg' }
  );
}

export async function startEasyVNSampleScene(): Promise<void> {
  registerEasyVNSampleScenes();
  await startScene('easyvn-welcome');
}
