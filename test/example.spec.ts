import { doUnaryCallAsync } from '../src/client_async'
import { strict as assert } from 'assert'

describe('Unary call', () => {
  test('should have response with async call', async () => {
    const message = await doUnaryCallAsync()
    assert.equal(message, 'Master', 'Have no async response')
  })
})
