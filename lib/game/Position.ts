export default class Position {
  constructor(public name: string) {}

  static PG = new Position('PG');
  static SG = new Position('SG');
  static SF = new Position('SF');
  static PF = new Position('PF');
  static C = new Position('C');

  static ALL_POSITIONS = [this.PG, this.SG, this.SF, this.PF, this.C];

  // eslint-disable-next-line sort-keys
  static SORT_ORDER = { PG: 1, SG: 2, SF: 3, PF: 4, C: 5 };
}
