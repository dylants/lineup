import _ from 'lodash';
import Player from './Player';
import Lineup, { LineupOutcome } from './Lineup';
import Position from './Position';
import Skill from './Skill';

function defaultPositionProbabilities(player: Player): void {
  player.positionProbabilities = player.skills.map((skill) => ({
    position: skill.position,
    score: skill.ability,
  }));
}

describe('Lineup', () => {
  let player: Player;
  beforeAll(() => {
    player = new Player('C', Skill.DEFAULT_C_SKILLS);
  });

  describe('isPositionTaken', () => {
    let lineup: Lineup;
    beforeEach(() => {
      lineup = new Lineup(0);
    });

    it('should return false when there are no assignments', () => {
      expect(lineup.isPositionTaken(Position.C)).toEqual(false);
    });

    it('should return false when the position is available', () => {
      lineup.addAssignment(player, Position.PF);
      expect(lineup.isPositionTaken(Position.C)).toEqual(false);
    });

    it('should return true when the position is taken', () => {
      lineup.addAssignment(player, Position.PF);
      expect(lineup.isPositionTaken(Position.PF)).toEqual(true);
    });
  });

  describe('findEmptyPositions', () => {
    let lineup: Lineup;
    beforeEach(() => {
      lineup = new Lineup(0);
    });

    it('returns the empty position when one is available', () => {
      lineup.addAssignment(player, Position.PG);
      lineup.addAssignment(player, Position.PF);
      lineup.addAssignment(player, Position.C);
      expect(lineup.findEmptyPositions()).toEqual([Position.SG, Position.SF]);
    });
    it('returns nothing when one is not available', () => {
      lineup.addAssignment(player, Position.PG);
      lineup.addAssignment(player, Position.SG);
      lineup.addAssignment(player, Position.SF);
      lineup.addAssignment(player, Position.PF);
      lineup.addAssignment(player, Position.C);
      expect(lineup.findEmptyPositions()).toEqual([]);
    });
  });

  describe('generateLineup', () => {
    describe('with too few players', () => {
      const players = [new Player('point', Skill.DEFAULT_PG_SKILLS)];

      it('should error', () => {
        expect(() => {
          Lineup.generateLineupOutcome(players, new Lineup(1));
        }).toThrow(/At least 5 players required/);
      });
    });

    describe('with standard players', () => {
      let players: Player[];
      let lineupOutcome: LineupOutcome;
      let lineup: Lineup;

      beforeEach(() => {
        players = [
          new Player('point', Skill.DEFAULT_PG_SKILLS),
          new Player('shoot', Skill.DEFAULT_SG_SKILLS),
          new Player('small', Skill.DEFAULT_SF_SKILLS),
          new Player('power', Skill.DEFAULT_PF_SKILLS),
          new Player('center', Skill.DEFAULT_C_SKILLS),
        ];
        players.forEach(defaultPositionProbabilities);

        lineupOutcome = Lineup.generateLineupOutcome(players, new Lineup(1));
        lineup = lineupOutcome.lineup;
      });

      it('should generate a lineup with every player included', () => {
        const lineupPlayerNames = _.map(
          lineup.assignments,
          (assignment) => assignment.player.name
        );
        const playerNames = players.map((player) => player.name);
        expect(lineupPlayerNames.sort()).toEqual(playerNames.sort());
      });

      it('should generate a lineup without duplicates', () => {
        const positionNames = _.map(
          lineup.assignments,
          (assignment) => assignment.position.name
        );
        const uniquePositionNames = _.uniq(positionNames);
        expect(positionNames.length).toEqual(uniquePositionNames.length);
      });

      it('should generate a lineup that contains each position', () => {
        const positionNames = _.map(
          lineup.assignments,
          (assignment) => assignment.position.name
        );
        expect(positionNames).toEqual(['PG', 'SG', 'SF', 'PF', 'C']);
      });

      it('should generate a LineupOutcome without any remaining players', () => {
        expect(lineupOutcome.remainingPlayers.length).toEqual(0);
      });
    });

    describe('with large mix of players', () => {
      let players: Player[];
      let lineupOutcome: LineupOutcome;
      let lineup: Lineup;
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

        lineupOutcome = Lineup.generateLineupOutcome(players, new Lineup(1));
        lineup = lineupOutcome.lineup;
      });

      it('should generate a lineup of 5 players', () => {
        expect(lineup.assignments.length).toEqual(5);
      });

      it('should generate a lineup without duplicates', () => {
        const positionNames = _.map(
          lineup.assignments,
          (assignment) => assignment.position.name
        );
        const uniquePositionNames = _.uniq(positionNames);
        expect(positionNames.length).toEqual(uniquePositionNames.length);
      });

      it('should generate a lineup that contains each position', () => {
        const positionNames = _.map(
          lineup.assignments,
          (assignment) => assignment.position.name
        );
        expect(positionNames).toEqual(['PG', 'SG', 'SF', 'PF', 'C']);
      });

      it('should generate a LineupOutcome with 5 remaining players', () => {
        expect(lineupOutcome.remainingPlayers.length).toEqual(5);
      });
    });

    describe('with an existing Lineup', () => {
      let lineupOutcome: LineupOutcome;

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

        lineupOutcome = Lineup.generateLineupOutcome(
          remainingPlayers,
          existingLineup
        );
      });

      it('should generate a lineup of 5 players', () => {
        expect(lineupOutcome.lineup.assignments.length).toEqual(5);
      });

      it('should generate a LineupOutcome without any remaining players', () => {
        expect(lineupOutcome.remainingPlayers.length).toEqual(0);
      });
    });
  });

  describe('generatePartialLineup', () => {
    describe('with 1 player', () => {
      let players: Player[];

      beforeEach(() => {
        players = [new Player('shoot', Skill.DEFAULT_SG_SKILLS)];
        players.forEach(defaultPositionProbabilities);
      });
      it('should assign to best position', () => {
        const lineup = Lineup.generatePartialLineup(players, 1);
        expect(lineup.assignments.length).toEqual(1);
        expect(lineup.assignments[0].position.name).toEqual('SG');
      });
    });

    describe('with 3 players', () => {
      let players: Player[];

      beforeEach(() => {
        players = [
          new Player('point', Skill.DEFAULT_PG_SKILLS),
          new Player('shoot', Skill.DEFAULT_SG_SKILLS),
          new Player('small', Skill.DEFAULT_SF_SKILLS),
        ];
        players.forEach(defaultPositionProbabilities);
      });
      it('should assign to best position', () => {
        const lineup = Lineup.generatePartialLineup(players, 1);
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
      let players: Player[];

      beforeEach(() => {
        players = [
          new Player('point1', Skill.DEFAULT_PG_SKILLS),
          new Player('point2', Skill.DEFAULT_PG_SKILLS),
        ];
        players.forEach(defaultPositionProbabilities);
      });
      it('should assign to best position', () => {
        const lineup = Lineup.generatePartialLineup(players, 1);
        expect(lineup.assignments.length).toEqual(2);

        expect(lineup.assignments[0].position.name).toEqual('PG');
        expect(lineup.assignments[0].player.name).toEqual('point1');

        expect(lineup.assignments[1].position.name).toEqual('SG');
        expect(lineup.assignments[1].player.name).toEqual('point2');
      });
    });

    describe('with more than 5 players', () => {
      let players: Player[];

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
      });
      it('should error', () => {
        expect(() => {
          Lineup.generatePartialLineup(players, 1);
        }).toThrow(/At most 5 players can be provided/);
      });
    });
  });
});
