import Player from './game/Player';
import Position from './game/Position';
import logger from './logger';
import SlightAdjustmentProbabilityModifier from './probability-modifiers/SlightAdjustmentProbabilityModifier';

export interface PositionOutcome {
  position: Position;
  outcome: number;
}

const slightAdjustmentProbabilityModifier =
  new SlightAdjustmentProbabilityModifier(0.5, 1.5);

export function populatePositionProbabilities(player: Player): void {
  // initially set each PositionProbability's score to the Skill's ability
  logger.debug('generating initial positionProbabilities for each player');
  player.positionProbabilities = player.skills.map((skill) => ({
    position: skill.position,
    score: skill.ability,
  }));

  logger.debug('running SlightAdjustmentProbabilityModifier');
  slightAdjustmentProbabilityModifier.modify(player);
}
