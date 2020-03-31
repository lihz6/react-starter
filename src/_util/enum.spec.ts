import { keyOf } from './enum';

enum Test {
  AAA = 'A',
  BBB = 'B',
}

test('Enum keyOf', () => {
  expect(keyOf(Test, Test.AAA)).toBe('AAA');
});
