import Player from '../game/Player';
import ProbabilityModifier from './ProbabilityModifier';
import logger from '../logger';
import _ from 'lodash';

export default class SlightAdjustmentProbabilityModifier
  implements ProbabilityModifier
{
  constructor(public lowerBound: number, public upperBound: number) {}

  modify(player: Player): void {
    const modifier = _.random(this.lowerBound, this.upperBound, true);
    logger.trace(
      'SlightAdjustmentProbabilityModifier::modify: modifier: %o',
      modifier
    );

    player.positionProbabilities.forEach((positionProbability) => {
      positionProbability.score = positionProbability.score * modifier;
    });
  }
}
