import _ from 'lodash';
import Assignment from '../game/Assignment';
import Lineup from '../game/Lineup';
import Player from '../game/Player';
import logger from '../logger';

export interface LineupBuilderResult {
  lineup: Lineup;
  playersNotSelected: Player[];
}

export default class LineupBuilder {
  private frame!: number;
  private players!: Player[];
  private initialLineup: Lineup | null | undefined;
  private optimizeForPositions!: boolean;

  constructor() {
    this.reset();
  }

  private reset(): void {
    this.frame = 1;
    this.players = [];
    this.initialLineup = null;
    this.optimizeForPositions = true;
  }

  setFrame(frame: number): LineupBuilder {
    this.frame = frame;
    return this;
  }

  setPlayers(players: Player[]): LineupBuilder {
    this.players = players;
    return this;
  }

  setInitialLineup(lineup: Lineup | undefined | null): LineupBuilder {
    this.initialLineup = lineup;
    return this;
  }

  setOptimizeForPositions(): LineupBuilder {
    this.optimizeForPositions = true;
    return this;
  }

  setOptimizeForPlayers(): LineupBuilder {
    this.optimizeForPositions = false;
    return this;
  }

  build(): LineupBuilderResult {
    let result: LineupBuilderResult;
    let lineup: Lineup;
    if (this.initialLineup) {
      lineup = this.initialLineup;
    } else {
      lineup = new Lineup(this.frame);
    }

    if (this.optimizeForPositions) {
      result = this.buildForPositions(lineup);
    } else {
      result = this.buildForPlayers(lineup);
    }

    this.reset();

    return result;
  }

  private buildForPositions(lineup: Lineup): LineupBuilderResult {
    logger.debug('building lineup, optimized for positions');

    // randomize the positions to fill
    const positionsToFill = _.shuffle(lineup.findEmptyPositions());

    if (!this.players || this.players.length < positionsToFill.length) {
      throw new Error(`At least ${positionsToFill.length} players required`);
    }

    const playersAvailable = _.clone(this.players);

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
          logger.debug('bestPlayerSoFar (default): %o', bestPlayerSoFar);
          continue;
        }

        // are you better than the current player?
        if (
          currentPlayer.hasHigherPositionProbability(position, bestPlayerSoFar)
        ) {
          bestPlayerSoFar = currentPlayer;
          bestPlayerSoFarIndex = index;
          logger.debug('bestPlayerSoFar (winner): %o', bestPlayerSoFar);
        }
      }

      logger.trace('assigning position to player: %o', bestPlayerSoFar);
      lineup.addAssignment(bestPlayerSoFar!, position);

      // remove the player we assigned so we don't assign to another position
      playersAvailable.splice(bestPlayerSoFarIndex, 1);
    });

    lineup.sortAssignments();

    logger.debug('lineup created');
    logger.trace('lineup %j', lineup);
    return {
      lineup,
      playersNotSelected: playersAvailable,
    };
  }

  private buildForPlayers(lineup: Lineup): LineupBuilderResult {
    logger.debug('building lineup, optimized for players');

    const playersAvailable = _.clone(this.players);

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
          logger.debug('adding assignment: %o', bestAssignment);
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

    logger.debug('lineup created');
    logger.trace('lineup %j', lineup);
    return {
      lineup,
      playersNotSelected: playersAvailable,
    };
  }
}
