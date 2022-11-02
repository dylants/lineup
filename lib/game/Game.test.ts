import _ from 'lodash';

import Game from './Game';
import { generateRandomPlayers } from '../utils';

describe('Game', () => {
  describe('generateGame', () => {
    let game: Game;

    describe('with 10 players', () => {
      const players = generateRandomPlayers(10);

      beforeAll(() => {
        game = Game.generateGame(players);
      });

      it('should assign all players evenly', () => {
        const playersAvailable = players.map((p) => p.name);
        const playersAssigned = _(game.lineups)
          .map((lineup) =>
            lineup.assignments.map((assignment) => assignment.player.name)
          )
          .flatten()
          .sort()
          .value();

        // 10 players available, and 20 assigned
        expect(playersAvailable.length).toEqual(10);
        expect(playersAssigned.length).toEqual(20);

        // each player is assigned twice, thus evenly
        const playersAvailableDouble = playersAvailable
          .concat(playersAvailable)
          .sort();
        expect(playersAvailableDouble).toEqual(playersAssigned);
      });
    });

    describe('with less than 5 players', () => {
      const players = generateRandomPlayers(4);

      it('should throw error for not enough players', () => {
        expect(() => {
          game = Game.generateGame(players);
        }).toThrow('not enough players for a Game');
      });
    });

    describe('with 9 players', () => {
      const players = generateRandomPlayers(9);

      beforeAll(() => {
        game = Game.generateGame(players);
      });

      it('should assign all players and 2 twice', () => {
        const playersAvailable = players.map((p) => p.name).sort();
        const playersAssigned = _(game.lineups)
          .map((lineup) =>
            lineup.assignments.map((assignment) => assignment.player.name)
          )
          .flatten()
          .value();

        // 9 available but 20 assigned
        expect(playersAvailable.length).toEqual(9);
        expect(playersAssigned.length).toEqual(20);

        // all players available have been assigned
        expect(_.difference(playersAvailable, playersAssigned)).toEqual([]);

        // each player should be assigned twice (18)
        const playersAvailableDouble =
          playersAvailable.concat(playersAvailable);
        playersAvailableDouble.forEach((player) => {
          playersAssigned.splice(playersAssigned.indexOf(player), 1);
        });
        // with 2 more players assigned (20)
        expect(playersAssigned.length).toEqual(2);
      });
    });

    describe('with 11 players', () => {
      const players = generateRandomPlayers(11);

      beforeAll(() => {
        game = Game.generateGame(players);
      });

      it('should do the best it can at building a game', () => {
        const playersAvailable = players.map((p) => p.name).sort();
        const playersAssigned = _(game.lineups)
          .map((lineup) =>
            lineup.assignments.map((assignment) => assignment.player.name)
          )
          .flatten()
          .value();

        // 11 available but 20 assigned
        expect(playersAvailable.length).toEqual(11);
        expect(playersAssigned.length).toEqual(20);

        // all players available have been assigned at least once
        expect(_.difference(playersAvailable, playersAssigned)).toEqual([]);
      });
    });
  });
});
