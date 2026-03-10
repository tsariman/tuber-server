import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  die,
  is_object,
  is_record,
  is_instance,
  is_struct,
  assure,
  ensure,
  has_property,
  parse_cookie,
  normalize_key,
  to_error_object,
  to_net_error_object,
  resolve,
} from '../../src/utility/index'

// ---------------------------------------------------------------------------
// die
// ---------------------------------------------------------------------------
describe('die', () => {
  it('throws in development mode', () => {
    const original = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    assert.throws(() => die('boom'), /boom/)
    process.env.NODE_ENV = original
  })

  it('does not throw outside development mode', () => {
    const original = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    assert.doesNotThrow(() => die('silent'))
    process.env.NODE_ENV = original
  })
})

// ---------------------------------------------------------------------------
// is_object
// ---------------------------------------------------------------------------
describe('is_object', () => {
  it('returns true for a plain object', () => {
    assert.strictEqual(is_object({ a: 1 }), true)
  })

  it('returns false for null', () => {
    assert.strictEqual(is_object(null), false)
  })

  it('returns false for an array', () => {
    assert.strictEqual(is_object([1, 2]), false)
  })

  it('returns false for a string', () => {
    assert.strictEqual(is_object('string'), false)
  })

  it('returns false for a number', () => {
    assert.strictEqual(is_object(42), false)
  })

  it('returns false for undefined', () => {
    assert.strictEqual(is_object(undefined), false)
  })
})

// ---------------------------------------------------------------------------
// is_record
// ---------------------------------------------------------------------------
describe('is_record', () => {
  it('returns true for a plain object', () => {
    assert.strictEqual(is_record({ key: 'val' }), true)
  })

  it('returns false for null', () => {
    assert.strictEqual(is_record(null), false)
  })

  it('returns false for an array', () => {
    assert.strictEqual(is_record([]), false)
  })
})

// ---------------------------------------------------------------------------
// is_instance
// ---------------------------------------------------------------------------
describe('is_instance', () => {
  it('returns true for a plain object', () => {
    assert.strictEqual(is_instance({ x: 1 }), true)
  })

  it('returns true for a class instance', () => {
    class Foo { bar = 1 }
    assert.strictEqual(is_instance(new Foo()), true)
  })

  it('returns false for null', () => {
    assert.strictEqual(is_instance(null), false)
  })

  it('returns false for a primitive', () => {
    assert.strictEqual(is_instance('string'), false)
  })
})

// ---------------------------------------------------------------------------
// is_struct
// ---------------------------------------------------------------------------
describe('is_struct', () => {
  it('returns true for an object', () => {
    assert.strictEqual(is_struct({ a: 1 }), true)
  })

  it('returns true for an array', () => {
    assert.strictEqual(is_struct([1, 2, 3]), true)
  })

  it('returns false for null', () => {
    assert.strictEqual(is_struct(null), false)
  })

  it('returns false for a string', () => {
    assert.strictEqual(is_struct('str'), false)
  })

  it('returns false for a number', () => {
    assert.strictEqual(is_struct(0), false)
  })
})

// ---------------------------------------------------------------------------
// assure
// ---------------------------------------------------------------------------
describe('assure', () => {
  it('returns the object when defined', () => {
    const obj = { a: 1 }
    assert.strictEqual(assure(obj), obj)
  })

  it('returns an empty object when undefined', () => {
    assert.deepStrictEqual(assure(undefined), {})
  })
})

// ---------------------------------------------------------------------------
// ensure
// ---------------------------------------------------------------------------
describe('ensure', () => {
  it('returns the value when defined', () => {
    const val = { x: 42 }
    assert.strictEqual(ensure(val), val)
  })

  it('returns an empty object when the value is undefined', () => {
    assert.deepStrictEqual(ensure(undefined), {})
  })

  it('returns an empty object when the value is null', () => {
    assert.deepStrictEqual(ensure(null), {})
  })
})

// ---------------------------------------------------------------------------
// has_property
// ---------------------------------------------------------------------------
describe('has_property', () => {
  it('returns true when the property exists', () => {
    assert.strictEqual(has_property({ name: 'Alice' }, 'name'), true)
  })

  it('returns false when the property is absent', () => {
    assert.strictEqual(has_property({ name: 'Alice' }, 'age'), false)
  })

  it('returns false for non-objects', () => {
    assert.strictEqual(has_property(null, 'key'), false)
    assert.strictEqual(has_property('string', 'key'), false)
    assert.strictEqual(has_property(42, 'key'), false)
  })
})

// ---------------------------------------------------------------------------
// parse_cookie
// ---------------------------------------------------------------------------
describe('parse_cookie', () => {
  it('parses a single cookie', () => {
    assert.deepStrictEqual(parse_cookie('token=abc123'), { token: 'abc123' })
  })

  it('parses multiple cookies', () => {
    assert.deepStrictEqual(parse_cookie('a=1; b=2; c=3'), { a: '1', b: '2', c: '3' })
  })

  it('returns an empty object for an empty string', () => {
    assert.deepStrictEqual(parse_cookie(''), {})
  })

  it('returns an empty object for undefined', () => {
    assert.deepStrictEqual(parse_cookie(undefined), {})
  })
})

// ---------------------------------------------------------------------------
// normalize_key
// ---------------------------------------------------------------------------
describe('normalize_key', () => {
  it('removes a leading slash', () => {
    assert.strictEqual(normalize_key('/foo'), 'foo')
  })

  it('leaves keys without a leading slash unchanged', () => {
    assert.strictEqual(normalize_key('foo'), 'foo')
  })

  it('only removes the first leading slash', () => {
    assert.strictEqual(normalize_key('//foo'), '/foo')
  })

  it('handles an empty string', () => {
    assert.strictEqual(normalize_key(''), '')
  })
})

// ---------------------------------------------------------------------------
// to_error_object
// ---------------------------------------------------------------------------
describe('to_error_object', () => {
  it('converts an Error instance correctly', () => {
    const err = new Error('test error')
    const result = to_error_object(err)
    assert.strictEqual(result.name, 'Error')
    assert.strictEqual(result.message, 'test error')
    assert.ok(typeof result.stack === 'string')
  })

  it('converts a non-Error value with a default name', () => {
    const result = to_error_object('something went wrong')
    assert.strictEqual(result.name, 'UnknownError')
    assert.strictEqual(result.message, 'something went wrong')
    assert.strictEqual(result.stack, undefined)
  })

  it('uses a custom name for non-Error values', () => {
    const result = to_error_object(42, 'CustomError')
    assert.strictEqual(result.name, 'CustomError')
    assert.strictEqual(result.message, '42')
  })
})

// ---------------------------------------------------------------------------
// to_net_error_object
// ---------------------------------------------------------------------------
describe('to_net_error_object', () => {
  it('converts a standard Error and sets response to undefined', () => {
    const err = new Error('net fail')
    const result = to_net_error_object(err)
    assert.strictEqual(result.name, 'Error')
    assert.strictEqual(result.message, 'net fail')
    assert.strictEqual(result.response, undefined)
  })

  it('sets response to undefined when the error carries extra properties', () => {
    // to_error_object only copies name/message/stack, so response is always
    // stripped before the has_property check — response will be undefined.
    const err = Object.assign(new Error('with response'), { response: { status: 404 } })
    const result = to_net_error_object(err)
    assert.strictEqual(result.message, 'with response')
    assert.strictEqual(result.response, undefined)
  })

  it('handles a non-Error value', () => {
    const result = to_net_error_object('something blew up')
    assert.strictEqual(result.name, 'UnknownError')
    assert.strictEqual(result.message, 'something blew up')
    assert.strictEqual(result.response, undefined)
  })
})

// ---------------------------------------------------------------------------
// resolve
// ---------------------------------------------------------------------------
describe('resolve', () => {
  const obj = {
    a: {
      b: {
        c: 42,
      },
      sibling: 'hello',
    },
    top: 'world',
  }

  it('resolves a top-level key', () => {
    const { parent, value } = resolve(obj, 'top')
    assert.strictEqual(value, 'world')
    assert.strictEqual(parent, obj)
  })

  it('resolves a deeply nested value', () => {
    const { parent, value } = resolve(obj, 'a.b.c')
    assert.strictEqual(value, 42)
    assert.strictEqual(parent, obj.a.b)
  })

  it('returns the correct immediate parent', () => {
    const { parent } = resolve(obj, 'a.sibling')
    assert.strictEqual(parent, obj.a)
  })

  it('returns undefined value for a missing key', () => {
    const { value } = resolve(obj, 'a.b.missing')
    assert.strictEqual(value, undefined)
  })

  it('returns undefined when an intermediate key does not exist', () => {
    const { value, parent } = resolve(obj, 'x.y.z')
    assert.strictEqual(value, undefined)
    assert.strictEqual(parent, obj)   // stopped at top level since 'x' is missing
  })

  it('returns undefined when path traverses a non-object', () => {
    const { value } = resolve(obj, 'top.extra')
    assert.strictEqual(value, undefined)
  })

  it('handles a single-segment path to a nested object', () => {
    const { value, parent } = resolve(obj, 'a')
    assert.strictEqual(value, obj.a)
    assert.strictEqual(parent, obj)
  })

  it('works with an array value at the resolved key', () => {
    const source = { list: [1, 2, 3] }
    const { value, parent } = resolve(source, 'list')
    assert.deepStrictEqual(value, [1, 2, 3])
    assert.strictEqual(parent, source)
  })

  it('works with a null value at the resolved key', () => {
    const source = { a: { b: null } }
    const { value, parent } = resolve(source, 'a.b')
    assert.strictEqual(value, null)
    assert.strictEqual(parent, source.a)
  })

  it('works with a boolean false value at the resolved key', () => {
    const source = { flags: { enabled: false } }
    const { value } = resolve(source, 'flags.enabled')
    assert.strictEqual(value, false)
  })

  it('resolves an element inside a top-level array', () => {
    const source = { items: ['a', 'b', 'c'] }
    const { parent, value } = resolve(source, 'items.1')
    assert.strictEqual(value, 'b')
    assert.strictEqual(parent, source.items)
  })

  it('resolves a nested object inside an array element', () => {
    const source = { list: [{ name: 'Alice' }, { name: 'Bob' }] }
    const { parent, value } = resolve(source, 'list.0.name')
    assert.strictEqual(value, 'Alice')
    assert.strictEqual(parent, source.list[0])
  })

  it('returns the correct parent when indexing into an array', () => {
    const source = { items: [10, 20, 30] }
    const { parent } = resolve(source, 'items.2')
    assert.strictEqual(parent, source.items)
  })

  it('returns undefined for an out-of-bounds array index', () => {
    const source = { items: [1, 2] }
    const { value } = resolve(source, 'items.5')
    assert.strictEqual(value, undefined)
  })

  it('returns undefined for a non-numeric key on an array', () => {
    const source = { items: [1, 2, 3] }
    const { value } = resolve(source, 'items.foo')
    assert.strictEqual(value, undefined)
  })

  it('resolves the first element of a nested array', () => {
    const source = { matrix: [[1, 2], [3, 4]] }
    const { value } = resolve(source, 'matrix.1.0')
    assert.strictEqual(value, 3)
  })
})
