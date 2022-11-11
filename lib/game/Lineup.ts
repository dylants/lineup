import _ from 'lodash';
import Assignment from './Assignment';
import logger from '../logger';
import Player from './Player';
import Position from './Position';

export interface LineupOutcome {
  lineup: Lineup;
  remainingPlayers: Player[];
}

export default class Lineup {
  assignments: Assignment[] = [];
  frame: number;

  constructor(frame: number) {
    this.frame = frame;
  }

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
    this.assignments.push({ player, position });
  }

  sortAssignments() {
    // Sort based on the Position definition
    this.assignments = _.sortBy(
      this.assignments,
      (assignment) =>
        Position.SORT_ORDER[assignment.position.name as keyof object]
    );
  }

  static generateLineupOutcome(players: Player[], frame = 1): LineupOutcome {
    if (!players || players.length < Position.ALL_POSITIONS.length) {
      throw new Error(
        `At least ${Position.ALL_POSITIONS.length} players required`
      );
    }

    const lineup: Lineup = new Lineup(frame);
    const playersAvailable = _.clone(players);
    // randomize the positions to fill
    const positionsToFill = _.shuffle(lineup.findEmptyPositions());

    // build the lineup per each position
    positionsToFill.forEach((position) => {
      logger.debug('attempting to fill position: %s', position.name);
      let bestPlayerSoFar = null;
      let bestPlayerSoFarIndex = -1;

      for (let index = 0; index < playersAvailable.length; index++) {
        const currentPlayer = playersAvailable[index];

        // if we've not picked a best player so far, you're it!
        if (!bestPlayerSoFar) {
          bestPlayerSoFar = currentPlayer;
          bestPlayerSoFarIndex = index;
          logger.debug('bestPlayerSoFar: %o', bestPlayerSoFar);
          continue;
        }

        // are you better than the current player?
        if (
          currentPlayer.hasHigherPositionProbability(position, bestPlayerSoFar)
        ) {
          bestPlayerSoFar = currentPlayer;
          bestPlayerSoFarIndex = index;
          logger.debug('bestPlayerSoFar: %o', bestPlayerSoFar);
        }
      }

      logger.trace('assigning position to player: %o', bestPlayerSoFar);
      lineup.addAssignment(bestPlayerSoFar!, position);

      // remove the player we assigned so we don't assign to another position
      playersAvailable.splice(bestPlayerSoFarIndex, 1);
    });

    lineup.sortAssignments();

    logger.trace('lineup %j', lineup);
    return {
      lineup,
      remainingPlayers: playersAvailable,
    };
  }
}
