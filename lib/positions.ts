interface Positions {
  [key: string]: number;
}

const POSITIONS: Positions = {
  PG: 0,
  SG: 1,
  SF: 2,
  PF: 3,
  C: 4,
};

export function getPositionNameFromIndex(index: number): string {
  const name = Object.keys(POSITIONS).find((key) => POSITIONS[key] === index);
  if (name === undefined) {
    throw new Error('bad position index');
  }
  return name;
}

export function getPositionIndexFromName(name: string): number {
  return POSITIONS[name];
}
