import Player from '../game/Player';

export default interface ProbabilityModifier {
  modify(player: Player): void;
}
