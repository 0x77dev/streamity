import { greet } from './greet'

describe('greet', () => {
  test('greet World', () => {
    expect(greet()).toBe('Hello World!')
  })

  test('greet Jest', () => {
    expect(greet('Jest')).toBe('Hello Jest!')
  })
})
