import Position from './Position';

export default class Skill {
  constructor(public position: Position, public ability: number) {}

  static DEFAULT_PG_SKILLS = [
    new Skill(Position.PG, 200),
    new Skill(Position.SG, 120),
    new Skill(Position.SF, 40),
    new Skill(Position.PF, 20),
    new Skill(Position.C, 5),
  ];
  static DEFAULT_SG_SKILLS = [
    new Skill(Position.PG, 120),
    new Skill(Position.SG, 200),
    new Skill(Position.SF, 50),
    new Skill(Position.PF, 20),
    new Skill(Position.C, 10),
  ];
  static DEFAULT_SF_SKILLS = [
    new Skill(Position.PG, 20),
    new Skill(Position.SG, 80),
    new Skill(Position.SF, 200),
    new Skill(Position.PF, 100),
    new Skill(Position.C, 20),
  ];
  static DEFAULT_PF_SKILLS = [
    new Skill(Position.PG, 10),
    new Skill(Position.SG, 20),
    new Skill(Position.SF, 80),
    new Skill(Position.PF, 200),
    new Skill(Position.C, 120),
  ];
  static DEFAULT_C_SKILLS = [
    new Skill(Position.PG, 5),
    new Skill(Position.SG, 20),
    new Skill(Position.SF, 40),
    new Skill(Position.PF, 120),
    new Skill(Position.C, 200),
  ];
}
