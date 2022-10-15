import _ from 'lodash';
import logger from './logger';
import { getPositionNameFromIndex } from './positions';
import {
  getProbabilitiesForPosition,
  generateRandomPosition,
} from './probabilities';

export function generateLineup(players: {}): { [key: string]: string } {
  const lineup: { [key: string]: string } = {};
  const positionsTaken = [];

  // randomize the players to select for the lineup
  const playersAvailable = _(players).keys().shuffle().value();

  // fill a lineup of 5 players
  while (positionsTaken.length < 5) {
    const playerName = playersAvailable.shift();
    logger.info('attempting to place player in lineup: %s', playerName);

    // if this is the last player, assign to the available position
    if (playersAvailable.length === 0) {
      const remainingPosition = _.difference(_.range(5), positionsTaken)[0];
      logger.info(
        'only one player remaining, assigning to remainingPosition %i',
        remainingPosition
      );
      lineup[playerName] = getPositionNameFromIndex(remainingPosition);
      break;
    }

    const positionName = players[playerName];
    const probabilities = getProbabilitiesForPosition(positionName);

    const positionIndex = generateRandomPosition(probabilities);
    logger.info('position index %i', positionIndex);

    if (positionsTaken.includes(positionIndex)) {
      logger.info('already have a player at this position, moving on...');
      playersAvailable.push(playerName);
    } else {
      // assign this player to the position
      positionsTaken.push(positionIndex);
      logger.info('positionsTaken %j', positionsTaken);
      lineup[playerName] = getPositionNameFromIndex(positionIndex);
    }
  }

  logger.info('lineup %j', lineup);
  return lineup;
}
