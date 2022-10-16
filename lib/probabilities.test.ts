import _ from 'lodash';
import Position from './Position';
import * as probabilities from './probabilities';
import Skill from './Skill';

describe('probabilities', () => {
  describe('generatePositionOutcomes', () => {
    let outcomes: probabilities.PositionOutcome[];
    beforeAll(() => {
      outcomes = probabilities.generatePositionOutcomes([
        new Skill(Position.PG, 1),
        new Skill(Position.SG, 2),
        new Skill(Position.SF, 3),
      ]);
    });

    it('should generate probability for each position', () => {
      expect(outcomes.length).toEqual(3);
    });
    it('should generate probabilities greater than 0', () => {
      expect(_.every(outcomes, (o) => o.outcome > 0)).toBeTruthy();
    });
    it('should generate probabilities less than max probability input', () => {
      expect(_.every(outcomes, (o) => o.outcome < 3)).toBeTruthy();
    });
  });

  describe('findProbablePosition', () => {
    it('should find the highest outcome (first)', () => {
      expect(
        probabilities.findProbablePosition([
          new Skill(Position.PG, 1),
          new Skill(Position.SG, 0),
          new Skill(Position.SF, 0),
        ])
      ).toEqual(Position.PG);
    });

    it('should find the highest outcome (middle)', () => {
      expect(
        probabilities.findProbablePosition([
          new Skill(Position.PG, 0),
          new Skill(Position.SG, 1),
          new Skill(Position.SF, 0),
        ])
      ).toEqual(Position.SG);
    });
  });
});
