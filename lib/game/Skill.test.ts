import Position from './Position';
import Skill from './Skill';

describe('Skill', () => {
  describe('getDefaultSkills', () => {
    it('should throw error on unknown Position', () => {
      expect(() => {
        Skill.getDefaultSkills(new Position('foo'));
      }).toThrow('unknown Position');
    });
  });
});
