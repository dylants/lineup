import { accessSync, constants } from 'fs';
import Player from './game/Player';
import Position from './game/Position';
import Skill from './game/Skill';
import { generateRandomPlayers, generateTeam } from './utils';

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

  describe('generateTeam', () => {
    let virtual: boolean;
    beforeEach(() => {
      jest.resetModules();
      try {
        accessSync('./my-team.ts', constants.R_OK);
        virtual = false;
      } catch (err) {
        virtual = true;
      }
    });

    describe('when my-team exists', () => {
      let player: Player;

      beforeEach(() => {
        player = new Player('Jordan', Skill.DEFAULT_SG_SKILLS);
        jest.mock('../my-team', () => [player], { virtual });
      });

      it('should return the team', () => {
        expect(generateTeam()).toEqual([player]);
      });
    });

    describe('when my-team does not exist', () => {
      beforeEach(() => {
        jest.mock(
          '../my-team',
          () => {
            throw new Error();
          },
          { virtual }
        );
      });

      it('should return 10 random players', () => {
        const team = generateTeam();
        expect(team.length).toEqual(10);
      });
    });
  });
});
