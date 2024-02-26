import { Bar } from './bar';

describe('Bar', () => {
  const sut = new Bar();

  describe('should return ', () => {
    it('false', () => {
      expect(sut.isBar(0)).toBeFalsy();
      expect(sut.isBar(1)).toBeFalsy();
    });
    it('true', () => {
      expect(sut.isBar(5)).toBeTruthy();
      expect(sut.isBar(10)).toBeTruthy();
    });
  });
});
