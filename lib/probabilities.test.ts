import _ from 'lodash';
import Position from './Position';
import * as probabilities from './probabilities';
import Skill from './Skill';

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
