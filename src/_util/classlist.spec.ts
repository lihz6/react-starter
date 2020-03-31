import classlist from './classlist';

test('Class List', () => {
  expect(classlist([{ a: { b: 'c' } }, 'd'])).toBe('a a-b a-b-c d');
});
