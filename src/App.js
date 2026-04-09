import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { DevConsole } from './ui/DevConsole';
const App = () => {
    const { state } = useGame();
    const [showDev, setShowDev] = React.useState(false);
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === '`')
                setShowDev(prev => !prev);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);
    const renderScene = () => {
        switch (state.currentScene) {
            case 'MAIN_MENU':
                return _jsx(MainMenu, {});
            case 'APARTMENT':
                return _jsx(ApartmentHub, {});
            case 'DISTRICT_EXPLORE':
                return _jsx(DistrictExplore, {});
            case 'BATTLE':
                return _jsx(BattleBoard, {});
            case 'DECK_EDITOR':
                return _jsx(DeckEditor, {});
            case 'STORE':
                return _jsx(CardShop, {});
            case 'PACK_OPENING':
                return _jsx(PackOpening, {});
            case 'SOCIAL':
                return _jsx(SocialHangout, {});
            case 'TOURNAMENT':
                return _jsx(Tournament, {});
            case 'TRANSIT':
                return _jsx(TransitStation, {});
            case 'PROFILE':
                return _jsx(Profile, {});
            default:
                return _jsx(MainMenu, {});
        }
    };
    return (_jsxs("div", { className: "app-container", children: [renderScene(), showDev && _jsx(DevConsole, { onClose: () => setShowDev(false) })] }));
};
export default App;
