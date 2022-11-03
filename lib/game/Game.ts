import _ from 'lodash';
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
          const difference = 5 - remainingPlayers.length;
          remainingPlayers = remainingPlayers.concat(
            _.times(difference, () => _.sample(players)!)
          );
        }

        const lineup = Lineup.generateLineup(remainingPlayers, frame);
        game.lineups.push(lineup);

        // find the remaining players
        const assignedPlayers = lineup.assignments.map((a) => a.player);
        remainingPlayers = _.difference(remainingPlayers, assignedPlayers);

        // move on to the next frame
        frame++;
      }
    }

    return game;
  }
}
