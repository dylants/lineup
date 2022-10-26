import _ from 'lodash';
import Player from './Player';
import Position from './Position';
import { generateRandomPlayers } from './utils';

describe('utils', () => {
  describe('generateRandomPlayers', () => {
    let players: Player[];

    describe('with evenly divisible amount', () => {
      beforeAll(() => {
        players = generateRandomPlayers(10);
      });

      it('should return correct number of players', () => {
        expect(players.length).toEqual(10);
      });
      it('should generate each position evenly', () => {
        const positions = players.map((p) => p.name.split('_')[0]).sort();
        const expectedPositions = Position.ALL_POSITIONS.concat(
          Position.ALL_POSITIONS
        )
          .map((p) => p.name)
          .sort();
        expect(positions).toEqual(expectedPositions);
      });
    });

    describe('with odd divisible amount', () => {
      beforeAll(() => {
        players = generateRandomPlayers(12);
      });

      it('should return correct number of players', () => {
        expect(players.length).toEqual(12);
      });
      it('should generate all positions 2 times, plus 2 more', () => {
        const positions = players.map((p) => p.name.split('_')[0]);
        const expectedPositions = Position.ALL_POSITIONS.concat(
          Position.ALL_POSITIONS
        ).map((p) => p.name);

        // for each expected position, remove the position from our actual list
        // this should leave us with 2 left -- those extra positions added
        expectedPositions.forEach((position) => {
          positions.splice(positions.indexOf(position), 1);
        });
        expect(positions.length).toEqual(2);
      });
    });
  });
});
