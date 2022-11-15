import Player from './Player';
import Position from './Position';
import Skill from './Skill';

describe('Player', () => {
  describe('getSkill', () => {
    let player: Player;

    beforeEach(() => {
      player = new Player('Jordan', Skill.DEFAULT_SG_SKILLS);
    });

    it('should return the correct skill', () => {
      expect(player.getSkill(Position.SG)).toEqual({
        ability: 100,
        position: Position.SG,
      });
    });

    it('should throw error when position does not exist', () => {
      expect(() => {
        player.getSkill(new Position('foo'));
      }).toThrow('unknown Position: foo');
    });
  });

  describe('getPositionProbability', () => {
    let player: Player;

    beforeEach(() => {
      player = new Player('Jordan', Skill.DEFAULT_SG_SKILLS);
      player.positionProbabilities.push({
        position: Position.SG,
        score: 100,
      });
    });

    it('should return the correct position probability', () => {
      expect(player.getPositionProbability(Position.SG)).toEqual({
        position: Position.SG,
        score: 100,
      });
    });

    it('should throw error when position does not exist', () => {
      expect(() => {
        player.getPositionProbability(new Position('foo'));
      }).toThrow('unknown Position: foo');
    });
  });

  describe('hasHigherPositionProbability', () => {
    let jordan: Player;
    let james: Player;

    beforeEach(() => {
      jordan = new Player('Jordan', Skill.DEFAULT_SG_SKILLS);
      jordan.positionProbabilities.push(
        {
          position: Position.SG,
          score: 100,
        },
        {
          position: Position.SF,
          score: 80,
        },
        {
          position: Position.PF,
          score: 50,
        }
      );

      james = new Player('James', Skill.DEFAULT_SG_SKILLS);
      james.positionProbabilities.push(
        {
          position: Position.SG,
          score: 80,
        },
        {
          position: Position.SF,
          score: 100,
        },
        {
          position: Position.PF,
          score: 50,
        }
      );
    });

    it('should return true when compared with a lower scored player', () => {
      expect(jordan.hasHigherPositionProbability(Position.SG, james)).toEqual(
        true
      );
    });

    it('should return false when compared with a higher scored player', () => {
      expect(jordan.hasHigherPositionProbability(Position.SF, james)).toEqual(
        false
      );
    });

    it('should return false when compared with an equal scored player', () => {
      expect(jordan.hasHigherPositionProbability(Position.PF, james)).toEqual(
        false
      );
    });
  });
});
