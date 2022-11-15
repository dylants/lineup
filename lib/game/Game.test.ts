import _ from 'lodash';

import Game from './Game';
import { generateRandomPlayers } from '../utils';
import Player from './Player';
import Skill from './Skill';
import Position from './Position';

function defaultPositionProbabilities(player: Player): void {
  player.positionProbabilities = player.skills.map((skill) => ({
    position: skill.position,
    score: skill.ability,
  }));
}

describe('Game', () => {
  describe('generateGame', () => {
    let game: Game;

    describe('with 10 players', () => {
      const players = generateRandomPlayers(10);

      beforeEach(() => {
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

      beforeEach(() => {
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

    describe('with 6 players', () => {
      const players = generateRandomPlayers(6);

      beforeEach(() => {
        game = Game.generateGame(players);
      });

      it('each lineup should have unique players', () => {
        game.lineups.forEach((lineup) => {
          const playerNames = _.map(
            lineup.assignments,
            (assignment) => assignment.player.name
          );
          const uniquePlayerNames = _.uniq(playerNames);
          expect(playerNames.length).toEqual(uniquePlayerNames.length);
        });
      });
    });

    describe('with 11 players', () => {
      const players = generateRandomPlayers(11);

      beforeEach(() => {
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

    describe('with 8 known players', () => {
      const players = [
        new Player('point1', Skill.DEFAULT_PG_SKILLS),
        new Player('shoot1', Skill.DEFAULT_SG_SKILLS),
        new Player('small1', Skill.DEFAULT_SF_SKILLS),
        new Player('power1', Skill.DEFAULT_PF_SKILLS),
        new Player('center1', Skill.DEFAULT_C_SKILLS),
        new Player('point2', Skill.DEFAULT_PG_SKILLS),
        new Player('small2', Skill.DEFAULT_SF_SKILLS),
        new Player('power2', Skill.DEFAULT_PF_SKILLS),
      ];
      players.forEach(defaultPositionProbabilities);
      // point2 is a little better at SG than point1
      players[5].positionProbabilities[1].score++;
      // power2 is a little better at C than power1
      players[7].positionProbabilities[4].score++;
      game = Game.generateGame(players);

      const expectedLineups = [
        // 1st frame get's the top 5 (in order)
        ['point1', 'shoot1', 'small1', 'power1', 'center1'],
        // 2nd frame gets the remaining 3 + best top 2 to fill gaps
        ['point2', 'shoot1', 'small2', 'power2', 'center1'],
        // 3rd frame takes best of remaining
        // minus 2 that filled gaps (shoot1 and center1)
        // and point2 is a good backup SG, power2 a good backup C
        ['point1', 'point2', 'small1', 'power1', 'power2'],
        // 4th frame takes last remaining player (small2)
        // and fills remaining lineup with best of all (in order)
        ['point1', 'shoot1', 'small2', 'power1', 'center1'],
      ];
      expectedLineups.forEach((expectedLineup, index) => {
        describe(`for lineup ${index}`, () => {
          const lineup = game.lineups[index];

          expectedLineup.forEach((name, index) => {
            it(`should assign correct player to position ${Position.ALL_POSITIONS[index].name}`, () => {
              expect(lineup.assignments[index].position.name).toEqual(
                Position.ALL_POSITIONS[index].name
              );
              expect(lineup.assignments[index].player.name).toEqual(name);
            });
          });
        });
      });
    });
  });
});
