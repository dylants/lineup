import _ from 'lodash';
import logger from './logger';
import {
  getPositionNameFromIndex,
  getPositionIndexFromName,
} from './positions';

const POSITION_PROBABILITIES: number[][] = [
  // PG
  [100, 80, 60, 40, 20],
  // SG
  [80, 100, 60, 40, 20],
  // SF
  [60, 80, 100, 80, 40],
  // PF
  [40, 60, 70, 100, 80],
  // C
  [20, 40, 60, 80, 100],
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

  _.forEach(players, (positionName, playerName) => {
    logger.info('finding position for player %s', playerName);
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
