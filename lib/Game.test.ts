import _ from 'lodash';
import Game from './Game';
import Player from './Player';
import Skill from './Skill';

describe('Game', () => {
  describe('generateGame with a standard set of players', () => {
    const players = [
      new Player('point1', Skill.DEFAULT_PG_SKILLS),
      new Player('point2', Skill.DEFAULT_PG_SKILLS),
      new Player('shoot1', Skill.DEFAULT_SG_SKILLS),
      new Player('power2', Skill.DEFAULT_PF_SKILLS),
      new Player('center2', Skill.DEFAULT_C_SKILLS),
      new Player('power3', Skill.DEFAULT_PF_SKILLS),
      new Player('small1', Skill.DEFAULT_SF_SKILLS),
      new Player('power1', Skill.DEFAULT_PF_SKILLS),
      new Player('small2', Skill.DEFAULT_SF_SKILLS),
      new Player('center1', Skill.DEFAULT_C_SKILLS),
    ];

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
