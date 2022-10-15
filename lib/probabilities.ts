import _ from 'lodash';
import logger from './logger';
import { getPositionIndexFromName } from './positions';

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
