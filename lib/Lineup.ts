import _ from 'lodash';
import Assignment from './Assignment';
import logger from './logger';
import Player from './Player';
import Position from './Position';
import { findProbablePosition } from './probabilities';

export default class Lineup {
  assignments: Assignment[] = [];
  frame: number;

  isPositionTaken(position: Position): boolean {
    const positions = _.map(
      this.assignments,
      (assignment) => assignment.position
    );
    return _.includes(positions, position);
  }

  findEmptyPositions(): Position[] {
    const positions = this.assignments.map((assignment) => assignment.position);
    return _.differenceBy(
      Position.ALL_POSITIONS,
      positions,
      (position) => position.name
    );
  }

  addAssignment(player: Player, position: Position) {
    this.assignments.push(new Assignment(player, position));
  }

  static generateLineup(players: Player[]): Lineup {
    const lineup: Lineup = new Lineup();

    // randomize the players to select for the lineup
    const playersAvailable = _.shuffle(players);

    // fill a lineup of 5 assignments
    while (lineup.assignments.length < 5) {
      const player = playersAvailable.shift();
      logger.debug('attempting to place player in assignment: %o', player);

      // if this is the last player, assign to an available position
      if (playersAvailable.length === 0) {
        const availablePosition = _.sample(lineup.findEmptyPositions());
        logger.debug(
          'only one player remaining, assigning to availablePosition %o',
          availablePosition
        );
        lineup.addAssignment(player, availablePosition);
        break;
      }

      const position: Position = findProbablePosition(player.skills);
      logger.debug('position %j', position);

      if (lineup.isPositionTaken(position)) {
        logger.debug('already have a player at this position, moving on...');
        playersAvailable.push(player);
      } else {
        // assign this player to the position
        logger.debug('adding player to the position');
        lineup.addAssignment(player, position);
      }
    }

    logger.debug('lineup %j', lineup);
    return lineup;
  }
}
