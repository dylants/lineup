import Position from './Position';

export default class Skill {
  constructor(public position: Position, public ability: number) {}

  static DEFAULT_PG_SKILLS = [
    new Skill(Position.PG, 100),
    new Skill(Position.SG, 80),
    new Skill(Position.SF, 40),
    new Skill(Position.PF, 20),
    new Skill(Position.C, 5),
  ];
  static DEFAULT_SG_SKILLS = [
    new Skill(Position.PG, 80),
    new Skill(Position.SG, 100),
    new Skill(Position.SF, 50),
    new Skill(Position.PF, 20),
    new Skill(Position.C, 10),
  ];
  static DEFAULT_SF_SKILLS = [
    new Skill(Position.PG, 20),
    new Skill(Position.SG, 80),
    new Skill(Position.SF, 100),
    new Skill(Position.PF, 60),
    new Skill(Position.C, 20),
  ];
  static DEFAULT_PF_SKILLS = [
    new Skill(Position.PG, 10),
    new Skill(Position.SG, 20),
    new Skill(Position.SF, 60),
    new Skill(Position.PF, 100),
    new Skill(Position.C, 80),
  ];
  static DEFAULT_C_SKILLS = [
    new Skill(Position.PG, 5),
    new Skill(Position.SG, 20),
    new Skill(Position.SF, 40),
    new Skill(Position.PF, 80),
    new Skill(Position.C, 100),
  ];

  static getDefaultSkills(position: Position): Skill[] {
    switch (position) {
      case Position.PG:
        return this.DEFAULT_PG_SKILLS;
      case Position.SG:
        return this.DEFAULT_SG_SKILLS;
      case Position.SF:
        return this.DEFAULT_SF_SKILLS;
      case Position.PF:
        return this.DEFAULT_PF_SKILLS;
      case Position.C:
        return this.DEFAULT_C_SKILLS;
    }
    throw new Error('unknown Position');
  }
}
