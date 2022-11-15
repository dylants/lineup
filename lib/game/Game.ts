import _ from 'lodash';
import logger from '../logger';
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
        logger.debug(`generating lineup for frame ${frame}`);

        let lineup: Lineup;
        if (remainingPlayers.length < MIN_PLAYERS_FOR_LINEUP) {
          logger.debug(
            'remainingPlayers less than min, generating partial lineup'
          );
          // if it's less than minimum, generate a partial lineup
          lineup = Lineup.generatePartialLineup(remainingPlayers);
          // reset the remaining players to the pool of other players
          // TODO add a concept like "needs rest" here to those that were picked in back-to-back frames
          remainingPlayers = _.differenceBy(
            players,
            remainingPlayers,
            (player) => player.name
          );
        } else {
          logger.debug('remainingPlayers more than min, generating lineup');
          // otherwise just create an empty lineup
          lineup = new Lineup(frame);
        }

        // generate the lineup outcome, using the existing lineup
        const lineupOutcome = Lineup.generateLineupOutcome(
          remainingPlayers,
          lineup
        );

        // store away the outcomes
        logger.debug(`storing lineup for frame ${frame}`);
        game.lineups.push(lineupOutcome.lineup);
        remainingPlayers = lineupOutcome.remainingPlayers;

        // move on to the next frame
        frame++;
      }
    }

    return game;
  }
}
