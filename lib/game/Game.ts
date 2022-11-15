import Lineup from './Lineup';
import Player from './Player';
import Position from './Position';

const NUM_FRAMES = 4;
const MIN_PLAYERS_FOR_LINEUP = Position.ALL_POSITIONS.length;

export default class Game {
  lineups: Lineup[] = [];

  static generateGame(players: Player[]): Game {
    if (players.length < MIN_PLAYERS_FOR_LINEUP) {
      throw new Error('not enough players for a Game');
    }

    const game = new Game();
    let frame = 1;

    while (frame <= NUM_FRAMES) {
      // (re)set the remaining players to the pool of players available
      let remainingPlayers: Player[] = players;

      while (remainingPlayers.length > 0) {
        // before we continue, verify the frame count
        if (frame > NUM_FRAMES) {
          break;
        }

        let lineup: Lineup;
        if (remainingPlayers.length < MIN_PLAYERS_FOR_LINEUP) {
          // if it's less than minimum, generate a partial lineup
          lineup = Lineup.generatePartialLineup(remainingPlayers);
          // reset the remaining players to the pool of players available
          remainingPlayers = players;
        } else {
          // otherwise just create an empty lineup
          lineup = new Lineup(frame);
        }

        // generate the lineup outcome, using the existing lineup
        const lineupOutcome = Lineup.generateLineupOutcome(
          remainingPlayers,
          lineup
        );

        // store away the outcomes
        game.lineups.push(lineupOutcome.lineup);
        remainingPlayers = lineupOutcome.remainingPlayers;

        // move on to the next frame
        frame++;
      }
    }

    return game;
  }
}
