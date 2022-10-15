import _ from 'lodash';
import { generateLineup } from './lineup';

describe('lineup', () => {
  describe('generateLineup with standard players', () => {
    const players = {
      point: 'PG',
      shoot: 'SG',
      strong: 'SF',
      power: 'PF',
      center: 'C',
    };
    let lineup: { [key: string]: string };
    beforeAll(() => {
      lineup = generateLineup(players);
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

  describe('generateLineup with large mix of players', () => {
    const players = {
      point1: 'PG',
      point2: 'PG',
      shoot1: 'SG',
      power2: 'PF',
      center2: 'C',
      power3: 'PF',
      strong1: 'SF',
      power1: 'PF',
      strong2: 'SF',
      center1: 'C',
    };
    let lineup: { [key: string]: string };
    beforeAll(() => {
      lineup = generateLineup(players);
    });

    it('should generate a lineup of 5 players', () => {
      expect(Object.keys(lineup).length).toEqual(5);
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
