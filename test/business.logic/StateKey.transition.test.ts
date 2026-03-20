import assert from 'node:assert'
import { describe, it } from 'node:test'
import * as Shared from '@tuber/shared'
import STATE_KEY from '../../src/business.logic/state.key'

function getLegacyStateKeyEntries(): Array<[string, string]> {
  const sharedEntries = Object.entries(Shared as Record<string, unknown>)

  return sharedEntries.reduce<Array<[string, string]>>((entries, [name, value]) => {
    if (!/^\$\d+_STATE_KEY$/.test(name) || typeof value !== 'string') {
      return entries
    }

      const numericId = name.match(/^\$(\d+)_STATE_KEY$/)?.[1]
      if (!numericId) throw new Error(`Unable to parse state key export name: ${name}`)
      entries.push([numericId, value])
      return entries
    }, [])
    .sort((left, right) => Number(left[0]) - Number(right[0]))
}

describe('STATE_KEY transition contract', () => {
  it('exports one migrated map entry for every legacy state key constant', () => {
    const legacyEntries = getLegacyStateKeyEntries()

    assert.strictEqual(legacyEntries.length, 80)
    assert.strictEqual(Object.keys(STATE_KEY).length, legacyEntries.length)
  })

  it('keeps every STATE_KEY[id] value aligned with the legacy $id_STATE_KEY export', () => {
    for (const [numericId, legacyValue] of getLegacyStateKeyEntries()) {
      assert.strictEqual(
        STATE_KEY[numericId as keyof typeof STATE_KEY],
        legacyValue,
        `Expected STATE_KEY['${numericId}'] to equal ${legacyValue}`,
      )
    }
  })

  it('keeps the numeric state key ids contiguous', () => {
    const ids = Object.keys(STATE_KEY).sort((left, right) => Number(left) - Number(right))

    assert.deepStrictEqual(
      ids,
      Array.from({ length: ids.length }, (_, index) => String(index + 1)),
    )
  })
})