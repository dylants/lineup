import _ from 'lodash';
import Position from './game/Position';
import Skill from './game/Skill';
import logger from './logger';

export interface PositionOutcome {
  position: Position;
  outcome: number;
}

/**
 * Randomly adds to each Player's Skill abilities, to generate the highest
 * scoring Position.
 *
 * @param skills the Player's Skills
 * @returns The highest scoring Position
 */
export function determinePositionOutcome(skills: Skill[]): Position {
  const positionOutcome = _.reduce(
    skills,
    (leadPO: PositionOutcome, skill: Skill) => {
      // generate an outcome based on the skill's ability
      const po: PositionOutcome = {
        position: skill.position,
        outcome: skill.ability * Math.random(),
      };
      logger.debug('position outcome %j', po);

      // return the winning outcome
      if (leadPO.outcome < po.outcome) {
        return po;
      } else {
        return leadPO;
      }
    },
    { position: null, outcome: 0 }
  );

  logger.debug('winning position outcome %j', positionOutcome);
  return positionOutcome.position;
}
