import _ from 'lodash';
import Player from '../game/Player';
import Lineup from '../game/Lineup';
import Position from '../game/Position';
import Skill from '../game/Skill';
import LineupBuilder, { LineupBuilderResult } from './LineupBuilder';

function defaultPositionProbabilities(player: Player): void {
  player.positionProbabilities = player.skills.map((skill) => ({
    position: skill.position,
    score: skill.ability,
  }));
}

describe('LineupBuilder', () => {
  let lineupBuilder: LineupBuilder;
  let lineupBuilderResult: LineupBuilderResult;
  let players: Player[];
  let lineup: Lineup;

  beforeEach(() => {
    lineupBuilder = new LineupBuilder();
  });

  describe('optimized for positions', () => {
    beforeEach(() => {
      lineupBuilder.setOptimizeForPositions();
    });

    describe('with too few players', () => {
      beforeEach(() => {
        players = [new Player('point', Skill.DEFAULT_PG_SKILLS)];
        lineupBuilder.setPlayers(players);
      });

      it('should error', () => {
        expect(() => {
          lineupBuilder.build();
        }).toThrow(/At least 5 players required/);
      });
    });

    describe('with standard players', () => {
      beforeEach(() => {
        players = [
          new Player('point', Skill.DEFAULT_PG_SKILLS),
          new Player('shoot', Skill.DEFAULT_SG_SKILLS),
          new Player('small', Skill.DEFAULT_SF_SKILLS),
          new Player('power', Skill.DEFAULT_PF_SKILLS),
          new Player('center', Skill.DEFAULT_C_SKILLS),
        ];
        players.forEach(defaultPositionProbabilities);

        lineupBuilder.setPlayers(players);
        lineupBuilderResult = lineupBuilder.build();
        lineup = lineupBuilderResult.lineup;
      });

      it('should generate a lineup with every player included', () => {
        const lineupPlayerNames = _.map(
          lineup.assignments,
          (assignment) => assignment.player.name
        );
        const playerNames = players.map((player) => player.name);
        expect(lineupPlayerNames.sort()).toEqual(playerNames.sort());
      });

      it('should generate a lineup that contains each (and only each) position', () => {
        const positionNames = _.map(
          lineup.assignments,
          (assignment) => assignment.position.name
        );
        expect(positionNames).toEqual(['PG', 'SG', 'SF', 'PF', 'C']);
      });

      it('should generate a lineup with all players selected', () => {
        expect(lineupBuilderResult.playersNotSelected.length).toEqual(0);
      });
    });

    describe('with large mix of players', () => {
      beforeEach(() => {
        players = [
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
        players.forEach(defaultPositionProbabilities);

        lineupBuilder.setPlayers(players);
        lineupBuilderResult = lineupBuilder.build();
        lineup = lineupBuilderResult.lineup;
      });

      it('should generate a lineup of 5 players', () => {
        expect(lineup.assignments.length).toEqual(5);
      });

      it('should generate a lineup that contains each (and only each) position', () => {
        const positionNames = _.map(
          lineup.assignments,
          (assignment) => assignment.position.name
        );
        expect(positionNames).toEqual(['PG', 'SG', 'SF', 'PF', 'C']);
      });

      it('should generate a lineup with 5 players not selected', () => {
        expect(lineupBuilderResult.playersNotSelected.length).toEqual(5);
      });
    });

    describe('with an existing Lineup', () => {
      beforeEach(() => {
        const assignedPlayers = [
          new Player('power', Skill.DEFAULT_PF_SKILLS),
          new Player('center', Skill.DEFAULT_C_SKILLS),
        ];
        assignedPlayers.forEach(defaultPositionProbabilities);
        const remainingPlayers = [
          new Player('point', Skill.DEFAULT_PG_SKILLS),
          new Player('shoot', Skill.DEFAULT_SG_SKILLS),
          new Player('small', Skill.DEFAULT_SF_SKILLS),
        ];
        remainingPlayers.forEach(defaultPositionProbabilities);

        const existingLineup = new Lineup(1);
        existingLineup.addAssignment(assignedPlayers[0], Position.PF);
        existingLineup.addAssignment(assignedPlayers[1], Position.C);

        lineupBuilder.setInitialLineup(existingLineup);
        lineupBuilder.setPlayers(remainingPlayers);
        lineupBuilderResult = lineupBuilder.build();
        lineup = lineupBuilderResult.lineup;
      });

      it('should generate a lineup of 5 players', () => {
        expect(lineup.assignments.length).toEqual(5);
      });

      it('should generate a lineup with all players selected', () => {
        expect(lineupBuilderResult.playersNotSelected.length).toEqual(0);
      });
    });
  });

  describe('optimized for players', () => {
    beforeEach(() => {
      lineupBuilder.setOptimizeForPlayers();
    });

    describe('with 1 player', () => {
      beforeEach(() => {
        players = [new Player('shoot', Skill.DEFAULT_SG_SKILLS)];
        players.forEach(defaultPositionProbabilities);

        lineupBuilder.setPlayers(players);
        lineupBuilderResult = lineupBuilder.build();
        lineup = lineupBuilderResult.lineup;
      });
      it('should assign to best position', () => {
        expect(lineup.assignments.length).toEqual(1);
        expect(lineup.assignments[0].position.name).toEqual('SG');
      });
    });

    describe('with 3 players', () => {
      beforeEach(() => {
        players = [
          new Player('point', Skill.DEFAULT_PG_SKILLS),
          new Player('shoot', Skill.DEFAULT_SG_SKILLS),
          new Player('small', Skill.DEFAULT_SF_SKILLS),
        ];
        players.forEach(defaultPositionProbabilities);

        lineupBuilder.setPlayers(players);
        lineupBuilderResult = lineupBuilder.build();
        lineup = lineupBuilderResult.lineup;
      });

      it('should assign to best position', () => {
        expect(lineup.assignments.length).toEqual(3);

        expect(lineup.assignments[0].position.name).toEqual('PG');
        expect(lineup.assignments[0].player.name).toEqual('point');

        expect(lineup.assignments[1].position.name).toEqual('SG');
        expect(lineup.assignments[1].player.name).toEqual('shoot');

        expect(lineup.assignments[2].position.name).toEqual('SF');
        expect(lineup.assignments[2].player.name).toEqual('small');
      });
    });

    describe('with 2 players of equal level', () => {
      beforeEach(() => {
        players = [
          new Player('point1', Skill.DEFAULT_PG_SKILLS),
          new Player('point2', Skill.DEFAULT_PG_SKILLS),
        ];
        players.forEach(defaultPositionProbabilities);

        lineupBuilder.setPlayers(players);
        lineupBuilderResult = lineupBuilder.build();
        lineup = lineupBuilderResult.lineup;
      });

      it('should assign to best position', () => {
        expect(lineup.assignments.length).toEqual(2);

        expect(lineup.assignments[0].position.name).toEqual('PG');
        expect(lineup.assignments[0].player.name).toEqual('point1');

        expect(lineup.assignments[1].position.name).toEqual('SG');
        expect(lineup.assignments[1].player.name).toEqual('point2');
      });
    });

    describe('with more than 5 players', () => {
      beforeEach(() => {
        players = [
          new Player('point', Skill.DEFAULT_PG_SKILLS),
          new Player('shoot', Skill.DEFAULT_SG_SKILLS),
          new Player('small', Skill.DEFAULT_SF_SKILLS),
          new Player('power', Skill.DEFAULT_PF_SKILLS),
          new Player('center', Skill.DEFAULT_C_SKILLS),
          new Player('another', Skill.DEFAULT_C_SKILLS),
        ];
        players.forEach(defaultPositionProbabilities);

        lineupBuilder.setPlayers(players);
      });

      it('should error', () => {
        expect(() => {
          lineupBuilder.build();
        }).toThrow(/At most 5 players can be provided/);
      });
    });
  });
});
