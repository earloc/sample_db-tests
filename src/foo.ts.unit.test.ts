import { Foo } from './foo';

describe('Foo', () => {
  const sut = new Foo();

  describe('should return', () => {
    it('false', () => {
      expect(sut.isFoo(0)).toBeFalsy();
      expect(sut.isFoo(1)).toBeFalsy();
    });
    it('true', () => {
      expect(sut.isFoo(3)).toBeTruthy();
      expect(sut.isFoo(6)).toBeTruthy();
    });
  });
});
