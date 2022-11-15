import _ from 'lodash';
import Assignment from './Assignment';
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
}
