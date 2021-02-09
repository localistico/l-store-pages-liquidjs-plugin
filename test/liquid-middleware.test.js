const {
  templatesMiddleware,
  notFoundMiddleware,
} = require('../src/').liquidMiddleware

test('should return function', async () => {
  expect(templatesMiddleware).toBeInstanceOf(Function)
  expect(notFoundMiddleware).toBeInstanceOf(Function)
})
