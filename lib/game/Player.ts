import Position from './Position';
import PositionProbability from './PositionProbability';
import Skill from './Skill';

export default class Player {
  positionProbabilities: PositionProbability[] = [];

  constructor(public name: string, public skills: Skill[]) {}

  getSkill(position: Position): Skill {
    const skill = this.skills.find(
      (skill) => skill.position.name === position.name
    );

    if (skill) {
      return skill;
    }
    throw new Error(`unknown Position: ${position.name}`);
  }

  getPositionProbability(position: Position): PositionProbability {
    const positionProbability = this.positionProbabilities.find(
      (positionProbability) =>
        positionProbability.position.name === position.name
    );

    if (positionProbability) {
      return positionProbability;
    }
    throw new Error(`unknown Position: ${position.name}`);
  }

  hasHigherPositionProbability(position: Position, player: Player): boolean {
    const myScore = this.getPositionProbability(position).score;
    const yourScore = player.getPositionProbability(position).score;

    return myScore > yourScore;
  }
}
