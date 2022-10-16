import _ from 'lodash';
import logger from './logger';
import Position from './Position';
import Skill from './Skill';

export interface PositionOutcome {
  position: Position;
  outcome: number;
}

export function generatePositionOutcomes(skills: Skill[]): PositionOutcome[] {
  const outcomes = _.map(skills, (skill) => {
    return {
      position: skill.position,
      outcome: skill.ability * Math.random(),
    };
  });
  logger.info('position outcomes %j', outcomes);
  return outcomes;
}

export function findProbablePosition(skills: Skill[]): Position {
  // generate an outcome number for each of the skill's ability
  const positionOutcomes = generatePositionOutcomes(skills);

  // find the highest outcome, and claim this as the position
  const highestPositionOutcome = _.reduce(positionOutcomes, (leadPO, po) => {
    if (!leadPO || leadPO.outcome < po.outcome) {
      return po;
    } else {
      return leadPO;
    }
  });
  return highestPositionOutcome.position;
}
