import _ from 'lodash';
import { populatePositionProbabilities } from '../probabilities';
import Lineup from './Lineup';
import Player from './Player';

const NUM_FRAMES = 4;

export default class Game {
  lineups: Lineup[] = [];

  static generateGame(players: Player[]): Game {
    if (players.length < 5) {
      throw new Error('not enough players for a Game');
    }

    const game = new Game();
    let frame = 1;

    // populate the position probabilities
    players.forEach(populatePositionProbabilities);

    while (frame <= NUM_FRAMES) {
      // (re)set the remaining players to the pool of players available
      let remainingPlayers: Player[] = players;

      while (remainingPlayers.length > 0) {
        // before we continue, verify the frame count
        if (frame > NUM_FRAMES) {
          break;
        }

        // if it's less than 5, add more to make it 5
        if (remainingPlayers.length < 5) {
          const otherPlayers = _.differenceBy(
            players,
            remainingPlayers,
            (player) => player.name
          );
          const difference = 5 - remainingPlayers.length;

          // shuffle the list of other players, and add the difference
          remainingPlayers = remainingPlayers.concat(
            _.shuffle(otherPlayers).slice(0, difference)
          );
        }

        // generate the lineup outcome
        const lineup = new Lineup(frame);
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
