import Position from './game/Position';
import Skill from './game/Skill';
import * as probabilities from './probabilities';

describe('probabilities', () => {
  describe('findProbablePosition', () => {
    it('should find the highest outcome (first)', () => {
      expect(
        probabilities.determinePositionOutcome([
          new Skill(Position.PG, 1),
          new Skill(Position.SG, 0),
          new Skill(Position.SF, 0),
        ])
      ).toEqual(Position.PG);
    });

    it('should find the highest outcome (middle)', () => {
      expect(
        probabilities.determinePositionOutcome([
          new Skill(Position.PG, 0),
          new Skill(Position.SG, 1),
          new Skill(Position.SF, 0),
        ])
      ).toEqual(Position.SG);
    });
  });
});
