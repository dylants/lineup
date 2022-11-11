import Player from './game/Player';
import Skill from './game/Skill';
import SlightAdjustmentProbabilityModifier from './probability-modifiers/SlightAdjustmentProbabilityModifier';
import * as probabilities from './probabilities';

jest.mock('./probability-modifiers/SlightAdjustmentProbabilityModifier');

describe('probabilities', () => {
  describe('populatePositionProbabilities', () => {
    let player: Player;

    beforeEach(() => {
      player = new Player('Jordan', Skill.DEFAULT_SG_SKILLS);
      probabilities.populatePositionProbabilities(player);
    });

    it('should populate the initial positionProbabilities', () => {
      player.positionProbabilities.forEach((positionProbability) => {
        const skill = player.getSkill(positionProbability.position);
        expect(positionProbability.score).toEqual(skill.ability);
      });
    });

    it('should call the correct class', () => {
      expect(SlightAdjustmentProbabilityModifier).toHaveBeenCalled();
      const mockModifier = (SlightAdjustmentProbabilityModifier as jest.Mock)
        .mock.instances[0];
      expect(mockModifier.modify).toHaveBeenCalled();
    });
  });
});
