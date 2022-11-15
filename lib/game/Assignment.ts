import Player from './Player';
import Position from './Position';

export default interface Assignment {
  player: Player;
  position: Position;
  score?: number;
}
