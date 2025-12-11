import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert'
import { Configuration } from '../../src/business.logic/Configuration'
import { IDbConfigurationDocument } from '../../src/schema/configuration'

describe('ServerConfig', () => {
  let config: Configuration

  beforeEach(() => {
    config = new Configuration()
  })

  describe('set, read, write', () => {
    it('should set and read a simple value', () => {
      config.set('simple', 'value')
      assert.strictEqual(config.read('simple'), 'value')
    })

    it('should set and read a nested value', () => {
      config.set('nested.key', 'value')
      assert.strictEqual(config.read('nested.key'), 'value')
    })

    it('should write (overwrite) a value', () => {
      config.set('key', 'old')
      config.write('key', 'new')
      assert.strictEqual(config.read('key'), 'new')
    })

    it('should handle default values', () => {
      assert.strictEqual(config.read('missing', 'default'), 'default')
    })
  })

  describe('delete and clear', () => {
    it('should delete a value', () => {
      config.set('key', 'value')
      config.delete('key')
      assert.strictEqual(config.read('key'), undefined)
    })

    it('should clear all values', () => {
      config.set('a', '1')
      config.set('b', '2')
      config.clear()
      assert.strictEqual(config.read('a'), undefined)
      assert.strictEqual(config.read('b'), undefined)
    })
  })

  describe('load', () => {
    it('should load string values into nested paths', async () => {
      const docs: IDbConfigurationDocument[] = [
        { key: 'simple', value: JSON.stringify('value') } as IDbConfigurationDocument,
        { key: 'nested.key', value: JSON.stringify('nestedValue') } as IDbConfigurationDocument
      ]
      await config.load(docs)
      assert.strictEqual(config.read('simple'), 'value')
      assert.strictEqual(config.read('nested.key'), 'nestedValue')
    })

    it('should parse and load JSON objects', async () => {
      const obj = { a: 1, b: 'test' }
      const docs: IDbConfigurationDocument[] = [
        { key: 'object', value: JSON.stringify(obj) } as IDbConfigurationDocument
      ]
      await config.load(docs)
      assert.deepStrictEqual(config.read('object'), obj)
    })

    it('should handle invalid JSON as string', async () => {
      const docs: IDbConfigurationDocument[] = [
        { key: 'invalid', value: '{invalid json' } as IDbConfigurationDocument
      ]
      await config.load(docs)
      assert.strictEqual(config.read('invalid'), '{invalid json')
    })

    it('should load multiple docs', async () => {
      const docs: IDbConfigurationDocument[] = [
        { key: 'a', value: JSON.stringify('1') } as IDbConfigurationDocument,
        { key: 'b.c', value: JSON.stringify('2') } as IDbConfigurationDocument,
        { key: 'b.d', value: JSON.stringify({ e: 3 }) } as IDbConfigurationDocument
      ]
      await config.load(docs)
      assert.strictEqual(config.read('a'), '1')
      assert.strictEqual(config.read('b.c'), '2')
      assert.deepStrictEqual(config.read('b.d'), { e: 3 })
    })
  })

  describe('proxy behavior', () => {
    it('should allow direct property access', () => {
      config.set('direct', 'access')
      assert.strictEqual((config as any).direct, 'access')
    })

    it('should set properties directly', () => {
      config.newProp = 'value'
      assert.strictEqual(config.read('newProp'), 'value')
    })
  })
})