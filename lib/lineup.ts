import _ from 'lodash';
import logger from './logger';
import {
  getPositionNameFromIndex,
  getPositionIndexFromName,
} from './positions';

const POSITION_PROBABILITIES: number[][] = [
  // PG
  [200, 120, 40, 20, 5],
  // SG
  [120, 200, 50, 20, 10],
  // SF
  [20, 80, 200, 100, 20],
  // PF
  [10, 20, 80, 200, 120],
  // C
  [5, 20, 40, 120, 200],
];

export function getProbabilitiesForPosition(positionName: string): number[] {
  const positionIndex = getPositionIndexFromName(positionName);
  return POSITION_PROBABILITIES[positionIndex];
}

export function generateProbabilityOutcomes(probabilities: number[]): number[] {
  const outcomes = _.map(
    probabilities,
    (probability) => probability * Math.random()
  );
  logger.info('probability outcomes %j', outcomes);
  return outcomes;
}

export function generateRandomPosition(probabilities: number[]): number {
  // generate an outcome number for each probability
  const outcomes = generateProbabilityOutcomes(probabilities);

  // find the highest outcome, and claim this as the position
  return _.indexOf(outcomes, _.max(outcomes));
}

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
