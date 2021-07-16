import { Game } from './app/game';
import { createContext } from "./storeUtils";

export const { StoreProvider, useStore } = createContext({
    Game: new Game("Andrey", "AndreyRomanovsy", 5000),
});
