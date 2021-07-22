/* eslint-disable no-unused-vars */
export enum GameStatus {
    WAITING_BETS, // waiting while player bet
    DEALING, // dealing cards all players and dealer
    PLAYING_PLAYERS, // each player do hit|double|split|stand
    PLAYING_DEALER, // dealer do hits before hand score < some number
    CALC_FINAL_RESULT, // before all player stand culculate final result
    CLEAR_CARDS,
}
export enum GameResult {
    BLACKJACK,
    WIN,
    TIE,
    LOSE,
}
