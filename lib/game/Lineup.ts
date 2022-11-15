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

  static generateLineupOutcome(
    players: Player[],
    lineup: Lineup
  ): LineupOutcome {
    // randomize the positions to fill
    const positionsToFill = _.shuffle(lineup.findEmptyPositions());

    if (!players || players.length < positionsToFill.length) {
      throw new Error(`At least ${positionsToFill.length} players required`);
    }

    const playersAvailable = _.clone(players);

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

  static generatePartialLineup(players: Player[], frame = 1): Lineup {
    const lineup = new Lineup(frame);

    const playersAvailable = _.clone(players);

    while (playersAvailable.length > 0) {
      const positionsToFill = lineup.findEmptyPositions();

      if (playersAvailable.length > positionsToFill.length) {
        throw new Error(
          `At most ${positionsToFill.length} players can be provided`
        );
      }

      // find the best assignments for the positions available
      let bestAssignments = positionsToFill.map((position): Assignment => {
        const bestPlayer = playersAvailable.reduce(
          (bestPlayer, currentPlayer) => {
            if (
              currentPlayer.hasHigherPositionProbability(position, bestPlayer)
            ) {
              return currentPlayer;
            } else {
              return bestPlayer;
            }
          }
        );

        const score = bestPlayer.getPositionProbability(position).score;

        return {
          player: bestPlayer,
          position,
          score,
        };
      });

      // sort these assignments based on the score
      bestAssignments = _.orderBy(bestAssignments, 'score', 'desc');

      // add assignments to the lineup for each unique player
      bestAssignments.forEach((bestAssignment) => {
        // while the best assignment player is available
        if (playersAvailable.includes(bestAssignment.player)) {
          // add the player's assignment to the lineup
          lineup.addAssignment(bestAssignment.player, bestAssignment.position);

          // remove the player from the available list
          _.remove(
            playersAvailable,
            (player) => player.name === bestAssignment.player.name
          );
        } else {
          return;
        }
      });
    }

    lineup.sortAssignments();

    logger.trace('lineup %j', lineup);
    return lineup;
  }
}
