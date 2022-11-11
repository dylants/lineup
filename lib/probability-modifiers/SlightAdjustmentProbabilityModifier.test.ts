import Player from '../game/Player';
import Skill from '../game/Skill';
import SlightAdjustmentProbabilityModifier from './SlightAdjustmentProbabilityModifier';

describe('SlightAdjustmentProbabilityModifier', () => {
  let modifier: SlightAdjustmentProbabilityModifier;
  let player: Player;

  beforeEach(() => {
    player = new Player('Jordan', Skill.DEFAULT_SG_SKILLS);
  });

  describe('when the bounds are 1', () => {
    beforeEach(() => {
      modifier = new SlightAdjustmentProbabilityModifier(1, 1);
      modifier.modify(player);
    });

    it('should modify correctly', () => {
      player.positionProbabilities.forEach((positionProbability) => {
        const skill = player.getSkill(positionProbability.position);
        expect(positionProbability.score).toEqual(skill.ability);
      });
    });
  });

  describe('when the bounds are 2', () => {
    beforeEach(() => {
      modifier = new SlightAdjustmentProbabilityModifier(2, 2);
      modifier.modify(player);
    });

    it('should modify correctly', () => {
      player.positionProbabilities.forEach((positionProbability) => {
        const skill = player.getSkill(positionProbability.position);
        expect(positionProbability.score).toEqual(skill.ability * 2);
      });
    });
  });
});
