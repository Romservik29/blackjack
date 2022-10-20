/* eslint-disable no-unused-vars */
export enum GameStatus {
    BetsOpen = 'BetsOpen', // waiting while player bet
    Dealing = 'Dealing', // dealing cards all players and dealer
    PlayingPlayers = 'PlayingPlayers', // each player do hit|double|split|stand
    PlayingDealer = 'PlayingDealer', // dealer do hits before hand score < some number
    Resolved = 'Resolved', // before all player stand culculate final result
    ClearCards = 'ClearCards',
}
export enum GameResult {
    BLACKJACK,
    WIN,
    TIE,
    LOSE,
}

export enum Suit {
    Heart = 'Hear',
    Diamond = 'Dimond',
    Club = 'Club',
    Spade = 'Spade',
}
