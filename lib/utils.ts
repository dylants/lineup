import _ from 'lodash';
import Player from './game/Player';
import Position from './game/Position';
import Skill from './game/Skill';

export function generateRandomPlayers(amount: number): Player[] {
  // perform the division, and save off both the quotient and remainder
  const quotient = Math.floor(amount / Position.ALL_POSITIONS.length);
  const remainder = amount % Position.ALL_POSITIONS.length;

  /*
   * Create a list of positions, adding the full set of positions for
   * each quotient. Fill in the random positions for the remainder.
   */
  const positions = _.flatten(
    _.times(quotient, () => Position.ALL_POSITIONS)
  ).concat(_.times(remainder, () => _.sample(Position.ALL_POSITIONS)!));

  // randomize the list, and create a new player for each position
  return _(positions)
    .shuffle()
    .map(
      (position, index) =>
        new Player(
          `${position.name}_${index}`,
          Skill.getDefaultSkills(position)
        )
    )
    .value();
}

export function generateTeam(): Player[] {
  try {
    return require('../my-team');
  } catch (err) {
    return generateRandomPlayers(10);
  }
}
