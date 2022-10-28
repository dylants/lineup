import _ from 'lodash';
import Player from './Player';
import Lineup from './Lineup';
import Position from './Position';
import Skill from './Skill';

describe('Lineup', () => {
  describe('isPositionTaken', () => {
    let lineup: Lineup;
    beforeEach(() => {
      lineup = new Lineup();
    });

    it('should return false when there are no assignments', () => {
      expect(lineup.isPositionTaken(Position.C)).toEqual(false);
    });

    it('should return false when the position is available', () => {
      lineup.addAssignment(null, Position.PF);
      expect(lineup.isPositionTaken(Position.C)).toEqual(false);
    });

    it('should return true when the position is taken', () => {
      lineup.addAssignment(null, Position.PF);
      expect(lineup.isPositionTaken(Position.PF)).toEqual(true);
    });
  });

  describe('findEmptyPositions', () => {
    let lineup: Lineup;
    beforeEach(() => {
      lineup = new Lineup();
    });

    it('returns the empty position when one is available', () => {
      lineup.addAssignment(null, Position.PG);
      lineup.addAssignment(null, Position.PF);
      lineup.addAssignment(null, Position.C);
      expect(lineup.findEmptyPositions()).toEqual([Position.SG, Position.SF]);
    });
    it('returns nothing when one is not available', () => {
      lineup.addAssignment(null, Position.PG);
      lineup.addAssignment(null, Position.SG);
      lineup.addAssignment(null, Position.SF);
      lineup.addAssignment(null, Position.PF);
      lineup.addAssignment(null, Position.C);
      expect(lineup.findEmptyPositions()).toEqual([]);
    });
  });

  describe('generateLineup with standard players', () => {
    const players = [
      new Player('point', Skill.DEFAULT_PG_SKILLS),
      new Player('shoot', Skill.DEFAULT_SG_SKILLS),
      new Player('small', Skill.DEFAULT_SF_SKILLS),
      new Player('power', Skill.DEFAULT_PF_SKILLS),
      new Player('center', Skill.DEFAULT_C_SKILLS),
    ];

    let lineup: Lineup;
    beforeAll(() => {
      lineup = Lineup.generateLineup(players);
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
  });

  describe('generateLineup with large mix of players', () => {
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

    let lineup: Lineup;
    beforeAll(() => {
      lineup = Lineup.generateLineup(players);
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
  });
});
