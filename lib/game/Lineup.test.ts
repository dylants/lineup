import Player from './Player';
import Lineup from './Lineup';
import Position from './Position';
import Skill from './Skill';

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
});
