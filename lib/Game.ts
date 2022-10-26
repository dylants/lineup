import _ from 'lodash';
import Lineup from './Lineup';
import Player from './Player';

export default class Game {
  lineups: Lineup[] = [];

  static generateGame(players: Player[]): Game {
    const game = new Game();

    let lineup: Lineup;
    let remainingPlayers: Player[] = players;
    while (remainingPlayers.length > 0) {
      lineup = Lineup.generateLineup(remainingPlayers);
      game.lineups.push(lineup);

      // find the remaining players
      const assignedPlayers = lineup.assignments.map((a) => a.player);
      remainingPlayers = _.difference(remainingPlayers, assignedPlayers);
    }

    return game;
  }
}
