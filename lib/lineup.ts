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

  _(players)
    .keys()
    .shuffle()
    .forEach((playerName) => {
      logger.info('finding position for player %s', playerName);

      // if we've got 4 positions found, just fill the last one
      if (positionsTaken.length === 4) {
        const remainingPosition = _.difference(_.range(5), positionsTaken)[0];
        logger.info('remainingPosition %i', remainingPosition);
        lineup[playerName] = getPositionNameFromIndex(remainingPosition);
        return;
      }

      const positionName = players[playerName];
      const probabilities = getProbabilitiesForPosition(positionName);

      let positionIndex: number;
      do {
        logger.info('looking for position...');
        positionIndex = generateRandomPosition(probabilities);
        logger.info('position index %i', positionIndex);
      } while (positionsTaken.includes(positionIndex));

      positionsTaken.push(positionIndex);
      logger.info('positionsTaken %j', positionsTaken);
      lineup[playerName] = getPositionNameFromIndex(positionIndex);
    });

  logger.info('lineup %j', lineup);
  return lineup;
}
