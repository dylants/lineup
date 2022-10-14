import _ from 'lodash';
import * as numbers from './lineup';

describe('lineup', () => {
  describe('generateProbabilityOutcomes', () => {
    let outcomes: number[];
    beforeAll(() => {
      outcomes = numbers.generateProbabilityOutcomes([1, 2, 3, 4, 5]);
    });

    it('should generate probability for each position', () => {
      expect(outcomes.length).toEqual(5);
    });
    it('should generate probabilities greater than 0', () => {
      expect(_.every(outcomes, (o) => o > 0)).toBeTruthy();
    });
  });

  describe('generateLineup with standard players', () => {
    const players = {
      alpha: 'PG',
      beta: 'SG',
      gamma: 'SF',
      delta: 'PF',
      epsilon: 'C',
    };
    let lineup: { [key: string]: string };
    beforeAll(() => {
      lineup = numbers.generateLineup(players);
    });

    it('should generate a lineup with every player included', () => {
      expect(Object.keys(lineup).sort()).toEqual(Object.keys(players).sort());
    });

    it('should generate a lineup without duplicates', () => {
      const lineupValues = _.values(lineup);
      const uniqueLineupValues = _.uniq(lineupValues);
      expect(lineupValues.length).toEqual(uniqueLineupValues.length);
    });

    it('should generate a lineup that contains each position', () => {
      const lineupValues = _.values(lineup).sort();
      expect(lineupValues).toEqual(['C', 'PF', 'PG', 'SF', 'SG']);
    });
  });
});
