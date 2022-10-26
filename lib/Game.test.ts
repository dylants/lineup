import _ from 'lodash';

import Game from './Game';
import { generateRandomPlayers } from './utils';

describe('Game', () => {
  describe('generateGame with a standard set of players', () => {
    const players = generateRandomPlayers(10);

    let game: Game;

    beforeAll(() => {
      game = Game.generateGame(players);
    });

    it('should assign all players', () => {
      const playersAvailable = players.map((p) => p.name).sort();
      const playersAssigned = _(game.lineups)
        .map((lineup) =>
          lineup.assignments.map((assignment) => assignment.player.name)
        )
        .flatten()
        .sort()
        .value();

      expect(playersAvailable).toEqual(playersAssigned);
    });
  });
});
