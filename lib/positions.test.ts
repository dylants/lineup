import * as positions from './positions';

describe('positions', () => {
  describe('getPositionNameFromIndex', () => {
    it('should return the correct position name', () => {
      expect(positions.getPositionNameFromIndex(0)).toEqual('PG');
      expect(positions.getPositionNameFromIndex(2)).toEqual('SF');
    });

    it('should throw error if invalid position index', () => {
      expect(() => positions.getPositionNameFromIndex(-1)).toThrowError();
    });
  });

  describe('getPositionIndexFromName', () => {
    it('should return the correct position index', () => {
      expect(positions.getPositionIndexFromName('SG')).toEqual(1);
      expect(positions.getPositionIndexFromName('C')).toEqual(4);
    });
  });
});
