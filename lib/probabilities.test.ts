import _ from 'lodash';
import * as probabilities from './probabilities';

describe('probabilities', () => {
  describe('generateProbabilityOutcomes', () => {
    let outcomes: number[];
    beforeAll(() => {
      outcomes = probabilities.generateProbabilityOutcomes([1, 2, 3, 4, 5]);
    });

    it('should generate probability for each position', () => {
      expect(outcomes.length).toEqual(5);
    });
    it('should generate probabilities greater than 0', () => {
      expect(_.every(outcomes, (o) => o > 0)).toBeTruthy();
    });
    it('should generate probabilities less than max probability input', () => {
      expect(_.every(outcomes, (o) => o < 5)).toBeTruthy();
    });
  });

  describe('generateRandomPosition', () => {
    it('should find the highest outcome', () => {
      expect(probabilities.generateRandomPosition([0, 0, 1])).toEqual(2);
    });
  });
});
