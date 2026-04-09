import React from 'react';
import { useGame } from './core/GameStateContext';
import { MainMenu } from './ui/MainMenu';
import { ApartmentHub } from './overworld/ApartmentHub';
import { DistrictExplore } from './overworld/DistrictExplore';
import { BattleBoard } from './battle/BattleBoard';
import { DeckEditor } from './cards/DeckEditor';
import { PackOpening } from './cards/PackOpening';

import { CardShop } from './economy/CardShop';

import { SocialHangout } from './social/SocialHangout';
import { Tournament } from './ui/Tournament';
import { TransitStation } from './ui/TransitStation';
import { Profile } from './ui/Profile';

const App: React.FC = () => {
  const { state } = useGame();

  const renderScene = () => {
    switch (state.currentScene) {
      case 'MAIN_MENU':
        return <MainMenu />;
      case 'APARTMENT':
        return <ApartmentHub />;
      case 'DISTRICT_EXPLORE':
        return <DistrictExplore />;
      case 'BATTLE':
        return <BattleBoard />;
      case 'DECK_EDITOR':
        return <DeckEditor />;
      case 'STORE':
        return <CardShop />;
      case 'PACK_OPENING':
        return <PackOpening />;
      case 'SOCIAL':
        return <SocialHangout />;
      case 'TOURNAMENT':
        return <Tournament />;
      case 'TRANSIT':
        return <TransitStation />;
      case 'PROFILE':
        return <Profile />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="app-container">
      {renderScene()}
    </div>
  );
};

export default App;
