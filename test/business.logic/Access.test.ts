import { describe, it } from 'node:test'
import assert from 'node:assert'
import Access from '../../src/business.logic/security/Access'
import CLEARANCE_LEVEL, { DENY_ALL } from '../../src/business.logic/security/clearance.level'
import type { IResource, IResourceSensitive } from '../../src/common.types'
import type { TContextualUser } from '../../src/schema/user'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeUser(overrides: Partial<TContextualUser> = {}): TContextualUser {
  return {
    _id: 'user-001' as unknown as TContextualUser['_id'],
    name: 'testuser',
    jwt_version: 1,
    role: 'free',
    ...overrides
  } as TContextualUser
}

function makeResource(overrides: Partial<IResource> = {}): IResource {
  return { user_id: 'user-001', inception_clearance: 0, ...overrides }
}

function makeSensitiveResource(overrides: Partial<IResourceSensitive> = {}): IResourceSensitive {
  return { _id: 'user-001', inception_clearance: 0, ...overrides }
}

// ---------------------------------------------------------------------------
// role getter
// ---------------------------------------------------------------------------

describe('Access – role getter', () => {
  it('returns "guest" when no user is provided', () => {
    const access = new Access()
    assert.strictEqual(access.role, 'guest')
  })

  it('returns "guest" when Access.the() is called without argument', () => {
    const access = Access.the()
    assert.strictEqual(access.role, 'guest')
  })

  it('returns the user role when a user is provided', () => {
    const access = new Access(makeUser({ role: 'moderator' }))
    assert.strictEqual(access.role, 'moderator')
  })

  it('Access.the() factory returns same shape as new Access()', () => {
    const usr = makeUser({ role: 'supporter' })
    const a1 = Access.the(usr)
    const a2 = new Access(usr)
    assert.strictEqual(a1.role, a2.role)
  })
})

// ---------------------------------------------------------------------------
// GATE – static configuration
// ---------------------------------------------------------------------------

describe('Access.GATE', () => {
  it('create.bookmark requires free clearance', () => {
    assert.strictEqual(Access.GATE['create.bookmark'], CLEARANCE_LEVEL.free)
  })

  it('read.unpublished.bookmark requires moderator clearance', () => {
    assert.strictEqual(Access.GATE['read.unpublished.bookmark'], CLEARANCE_LEVEL.moderator)
  })

  it('bookmark.publish requires supporter clearance', () => {
    assert.strictEqual(Access.GATE['bookmark.publish'], CLEARANCE_LEVEL.supporter)
  })

  it('bookmark.moderate requires moderator clearance', () => {
    assert.strictEqual(Access.GATE['bookmark.moderate'], CLEARANCE_LEVEL.moderator)
  })

  it('user.admin requires administrator clearance', () => {
    assert.strictEqual(Access.GATE['user.admin'], CLEARANCE_LEVEL.administrator)
  })

  it('system.developer requires developer clearance', () => {
    assert.strictEqual(Access.GATE['system.developer'], CLEARANCE_LEVEL.developer)
  })

  it('publish.unknown.bookmark requires moderator clearance', () => {
    assert.strictEqual(Access.GATE['publish.unknown.bookmark'], CLEARANCE_LEVEL.moderator)
  })

  // Bug detection: duplicate / aliased keys should map to the same level
  it('bookmark.publish and publish.bookmark have matching clearance levels', () => {
    assert.strictEqual(Access.GATE['bookmark.publish'], Access.GATE['publish.bookmark'])
  })

  it('get.user and user.get have matching clearance levels', () => {
    assert.strictEqual(Access.GATE['get.user'], Access.GATE['user.get'])
  })
})

// ---------------------------------------------------------------------------
// can / cannot / cant
// ---------------------------------------------------------------------------

describe('Access – can()', () => {
  it('guest cannot create a bookmark (requires free)', () => {
    const access = Access.the()
    assert.strictEqual(access.can('create.bookmark'), false)
  })

  it('free user can create a bookmark', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    assert.strictEqual(access.can('create.bookmark'), true)
  })

  it('free user cannot toggle search scope... wait – toggle.search.scope requires free', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    assert.strictEqual(Access.GATE['toggle.search.scope'], CLEARANCE_LEVEL.free)
    assert.strictEqual(access.can('toggle.search.scope'), true)
  })

  it('guest cannot toggle search scope (requires free)', () => {
    const access = Access.the()
    assert.strictEqual(access.can('toggle.search.scope'), false)
  })

  it('supporter can publish a bookmark', () => {
    const access = Access.the(makeUser({ role: 'supporter' }))
    assert.strictEqual(access.can('publish.bookmark'), true)
  })

  it('free user cannot publish a bookmark', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    assert.strictEqual(access.can('publish.bookmark'), false)
  })

  it('moderator can read unpublished bookmarks', () => {
    const access = Access.the(makeUser({ role: 'moderator' }))
    assert.strictEqual(access.can('read.unpublished.bookmark'), true)
  })

  it('supporter cannot read unpublished bookmarks', () => {
    const access = Access.the(makeUser({ role: 'supporter' }))
    assert.strictEqual(access.can('read.unpublished.bookmark'), false)
  })

  it('moderator cannot perform user.admin', () => {
    const access = Access.the(makeUser({ role: 'moderator' }))
    assert.strictEqual(access.can('user.admin'), false)
  })

  it('administrator can perform user.admin', () => {
    const access = Access.the(makeUser({ role: 'administrator' }))
    assert.strictEqual(access.can('user.admin'), true)
  })

  it('developer can access dev_install_page.view', () => {
    const access = Access.the(makeUser({ role: 'developer' }))
    assert.strictEqual(access.can('dev_install_page.view'), true)
  })

  it('administrator cannot access dev_install_page.view (requires developer)', () => {
    const access = Access.the(makeUser({ role: 'administrator' }))
    assert.strictEqual(access.can('dev_install_page.view'), false)
  })

  it('owner has highest clearance and can do everything', () => {
    const access = Access.the(makeUser({ role: 'owner' }))
    const keys = Object.keys(Access.GATE) as Array<keyof typeof Access.GATE>
    keys.forEach(key => {
      assert.strictEqual(access.can(key), true, `expected owner to can("${key}")`)
    })
  })
})

describe('Access – cannot()', () => {
  it('is always the inverse of can()', () => {
    const roles = ['guest', 'free', 'supporter', 'moderator', 'administrator', 'developer', 'owner'] as const
    const keys = Object.keys(Access.GATE) as Array<keyof typeof Access.GATE>
    roles.forEach(role => {
      const usr = role === 'guest' ? undefined : makeUser({ role })
      const access = Access.the(usr)
      keys.forEach(key => {
        assert.strictEqual(
          access.cannot(key),
          !access.can(key),
          `cannot() should equal !can() for role="${role}", key="${key}"`
        )
      })
    })
  })
})

describe('Access – cant()', () => {
  it('cant is an alias for cannot', () => {
    const free = Access.the(makeUser({ role: 'free' }))
    assert.strictEqual(free.cant('bookmark.publish'), free.cannot('bookmark.publish'))
    assert.strictEqual(free.cant('create.bookmark'), free.cannot('create.bookmark'))
  })

  it('cant returns true when guest tries to create a bookmark', () => {
    const access = Access.the()
    assert.strictEqual(access.cant('create.bookmark'), true)
  })
})

// ---------------------------------------------------------------------------
// canRead
// ---------------------------------------------------------------------------

describe('Access – canRead()', () => {
  it('owner of the resource can read it', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    const resource = makeResource({ user_id: 'user-001' })
    assert.strictEqual(access.canRead(resource), true)
  })

  it('non-owner with free role cannot read another user\'s resource', () => {
    const access = Access.the(makeUser({ role: 'free', _id: 'user-001' as unknown as TContextualUser['_id'] }))
    const resource = makeResource({ user_id: 'other-user' })
    assert.strictEqual(access.canRead(resource), false)
  })

  it('moderator can read any resource regardless of ownership', () => {
    const access = Access.the(makeUser({ role: 'moderator', _id: 'mod-001' as unknown as TContextualUser['_id'] }))
    const resource = makeResource({ user_id: 'other-user' })
    assert.strictEqual(access.canRead(resource), true)
  })

  it('guest cannot read another user\'s resource', () => {
    const access = Access.the()
    const resource = makeResource({ user_id: 'other-user' })
    assert.strictEqual(access.canRead(resource), false)
  })

  it('guest cannot read a resource with undefined user_id', () => {
    const access = Access.the() // _usr is undefined => _id is undefined
    const resource: IResource = {} // user_id is undefined
    // Previously: undefined === undefined → true (security bug, now fixed)
    assert.strictEqual(access.canRead(resource), false)
  })

  it('cannotRead is the negation of canRead', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    const own = makeResource({ user_id: 'user-001' })
    const other = makeResource({ user_id: 'other' })
    assert.strictEqual(access.cannotRead(own), false)
    assert.strictEqual(access.cannotRead(other), true)
  })
})

// ---------------------------------------------------------------------------
// canReadSensitive
// ---------------------------------------------------------------------------

describe('Access – canReadSensitive()', () => {
  it('user can read a sensitive resource when _id matches', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    const resource = makeSensitiveResource({ _id: 'user-001' })
    assert.strictEqual(access.canReadSensitive(resource), true)
  })

  it('user cannot read a sensitive resource belonging to another user', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    const resource = makeSensitiveResource({ _id: 'other-user' })
    assert.strictEqual(access.canReadSensitive(resource), false)
  })

  it('moderator can read any sensitive resource', () => {
    const access = Access.the(makeUser({ role: 'moderator', _id: 'mod-001' as unknown as TContextualUser['_id'] }))
    const resource = makeSensitiveResource({ _id: 'other-user' })
    assert.strictEqual(access.canReadSensitive(resource), true)
  })

  // Bug: same undefined === undefined issue as canRead
  it('guest cannot read a sensitive resource with no _id', () => {
    const access = Access.the()
    const resource: IResourceSensitive = {}
    // Previously: undefined === undefined → true (security bug, now fixed)
    assert.strictEqual(access.canReadSensitive(resource), false)
  })

  it('cannotReadSensitive is the negation of canReadSensitive', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    const own = makeSensitiveResource({ _id: 'user-001' })
    const other = makeSensitiveResource({ _id: 'other' })
    assert.strictEqual(access.cannotReadSensitive(own), false)
    assert.strictEqual(access.cannotReadSensitive(other), true)
  })
})

// ---------------------------------------------------------------------------
// canEdit / canDelete
// ---------------------------------------------------------------------------

describe('Access – canEdit()', () => {
  it('resource owner can edit regardless of role', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    const resource = makeResource({ user_id: 'user-001' })
    assert.strictEqual(access.canEdit(resource), true)
  })

  it('non-owner free user cannot edit', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    const resource = makeResource({ user_id: 'other-user' })
    assert.strictEqual(access.canEdit(resource), false)
  })

  it('moderator can edit a resource with inception_clearance below moderator level (0)', () => {
    const access = Access.the(makeUser({ role: 'moderator', _id: 'mod-001' as unknown as TContextualUser['_id'] }))
    const resource = makeResource({ user_id: 'other-user', inception_clearance: 0 })
    assert.strictEqual(access.canEdit(resource), true)
  })

  it('moderator cannot edit a resource with inception_clearance equal to moderator level', () => {
    // CLEARANCE_LEVEL.moderator = 4; condition requires > not >=
    const access = Access.the(makeUser({ role: 'moderator', _id: 'mod-001' as unknown as TContextualUser['_id'] }))
    const resource = makeResource({ user_id: 'other-user', inception_clearance: CLEARANCE_LEVEL.moderator })
    assert.strictEqual(access.canEdit(resource), false)
  })

  it('administrator can edit a resource with moderator inception_clearance (admin=5 > mod=4)', () => {
    const access = Access.the(makeUser({ role: 'administrator', _id: 'admin-001' as unknown as TContextualUser['_id'] }))
    const resource = makeResource({ user_id: 'other-user', inception_clearance: CLEARANCE_LEVEL.moderator })
    assert.strictEqual(access.canEdit(resource), true)
  })

  it('guest cannot edit any resource it does not own', () => {
    const access = Access.the()
    const resource = makeResource({ user_id: 'other-user' })
    assert.strictEqual(access.canEdit(resource), false)
  })

  // Bug: guest with no _id + resource with no user_id → previously undefined === undefined
  it('guest cannot edit a resource with no user_id', () => {
    const access = Access.the()
    const resource: IResource = {}
    // Previously: undefined === undefined → true (security bug, now fixed)
    assert.strictEqual(access.canEdit(resource), false)
  })

  it('inception_clearance defaults to 0 when not set', () => {
    const access = Access.the(makeUser({ role: 'moderator', _id: 'mod-001' as unknown as TContextualUser['_id'] }))
    const resource: IResource = { user_id: 'other-user' } // inception_clearance omitted
    assert.strictEqual(access.canEdit(resource), true)
  })

  it('cannotEdit is the negation of canEdit', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    const own = makeResource({ user_id: 'user-001' })
    const other = makeResource({ user_id: 'other' })
    assert.strictEqual(access.cannotEdit(own), false)
    assert.strictEqual(access.cannotEdit(other), true)
  })
})

describe('Access – canDelete()', () => {
  it('resource owner can delete regardless of role', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    const resource = makeResource({ user_id: 'user-001' })
    assert.strictEqual(access.canDelete(resource), true)
  })

  it('non-owner free user cannot delete', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    const resource = makeResource({ user_id: 'other-user' })
    assert.strictEqual(access.canDelete(resource), false)
  })

  it('moderator can delete a resource with inception_clearance 0', () => {
    const access = Access.the(makeUser({ role: 'moderator', _id: 'mod-001' as unknown as TContextualUser['_id'] }))
    const resource = makeResource({ user_id: 'other-user', inception_clearance: 0 })
    assert.strictEqual(access.canDelete(resource), true)
  })

  it('moderator cannot delete a resource whose inception_clearance equals moderator level', () => {
    const access = Access.the(makeUser({ role: 'moderator', _id: 'mod-001' as unknown as TContextualUser['_id'] }))
    const resource = makeResource({ user_id: 'other-user', inception_clearance: CLEARANCE_LEVEL.moderator })
    assert.strictEqual(access.canDelete(resource), false)
  })

  it('administrator can delete a resource with moderator inception_clearance', () => {
    const access = Access.the(makeUser({ role: 'administrator', _id: 'admin-001' as unknown as TContextualUser['_id'] }))
    const resource = makeResource({ user_id: 'other-user', inception_clearance: CLEARANCE_LEVEL.moderator })
    assert.strictEqual(access.canDelete(resource), true)
  })

  it('canDelete mirrors canEdit logic symmetrically', () => {
    const roles = ['free', 'supporter', 'moderator', 'administrator', 'developer', 'owner'] as const
    const resource = makeResource({ user_id: 'other-user', inception_clearance: 0 })
    roles.forEach(role => {
      const access = Access.the(makeUser({ role, _id: 'someone-else' as unknown as TContextualUser['_id'] }))
      assert.strictEqual(
        access.canDelete(resource),
        access.canEdit(resource),
        `canDelete and canEdit should match for role="${role}"`
      )
    })
  })
})

// ---------------------------------------------------------------------------
// canEditSensitive
// ---------------------------------------------------------------------------

describe('Access – canEditSensitive()', () => {
  it('owner can edit sensitive resource', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    const resource = makeSensitiveResource({ _id: 'user-001' })
    assert.strictEqual(access.canEditSensitive(resource), true)
  })

  it('non-owner free user cannot edit sensitive resource', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    const resource = makeSensitiveResource({ _id: 'other-user' })
    assert.strictEqual(access.canEditSensitive(resource), false)
  })

  it('moderator can edit sensitive resource with inception_clearance 0', () => {
    const access = Access.the(makeUser({ role: 'moderator', _id: 'mod-001' as unknown as TContextualUser['_id'] }))
    const resource = makeSensitiveResource({ _id: 'other-user', inception_clearance: 0 })
    assert.strictEqual(access.canEditSensitive(resource), true)
  })

  it('moderator cannot edit sensitive resource with inception_clearance = moderator level', () => {
    const access = Access.the(makeUser({ role: 'moderator', _id: 'mod-001' as unknown as TContextualUser['_id'] }))
    const resource = makeSensitiveResource({ _id: 'other-user', inception_clearance: CLEARANCE_LEVEL.moderator })
    assert.strictEqual(access.canEditSensitive(resource), false)
  })

  it('cannotEditSensitive is the negation of canEditSensitive', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    const own = makeSensitiveResource({ _id: 'user-001' })
    const other = makeSensitiveResource({ _id: 'other' })
    assert.strictEqual(access.cannotEditSensitive(own), false)
    assert.strictEqual(access.cannotEditSensitive(other), true)
  })

  // Bug: same undefined === undefined issue
  it('guest cannot edit a sensitive resource with no _id', () => {
    const access = Access.the()
    const resource: IResourceSensitive = {}
    // Previously: undefined === undefined → true (security bug, now fixed)
    assert.strictEqual(access.canEditSensitive(resource), false)
  })
})

// ---------------------------------------------------------------------------
// hasClearance / decide
// ---------------------------------------------------------------------------

describe('Access – hasClearance() / decide()', () => {
  it('returns the Access instance for chaining', () => {
    const access = Access.the(makeUser())
    const result = access.hasClearance('moderator')
    assert.strictEqual(result, access)
  })

  it('guest denied when clearance requires free', () => {
    const result = Access.the().hasClearance('free').decide('granted', 'denied')
    assert.strictEqual(result, 'denied')
  })

  it('free user granted when clearance requires free', () => {
    const result = Access.the(makeUser({ role: 'free' })).hasClearance('free').decide('granted', 'denied')
    assert.strictEqual(result, 'granted')
  })

  it('free user denied when clearance requires supporter', () => {
    const result = Access.the(makeUser({ role: 'free' })).hasClearance('supporter').decide('granted', 'denied')
    assert.strictEqual(result, 'denied')
  })

  it('supporter granted when clearance requires supporter', () => {
    const result = Access.the(makeUser({ role: 'supporter' })).hasClearance('supporter').decide('granted', 'denied')
    assert.strictEqual(result, 'granted')
  })

  it('moderator granted when clearance requires moderator', () => {
    const result = Access.the(makeUser({ role: 'moderator' })).hasClearance('moderator').decide('granted', 'denied')
    assert.strictEqual(result, 'granted')
  })

  it('moderator denied when clearance requires administrator', () => {
    const result = Access.the(makeUser({ role: 'moderator' })).hasClearance('administrator').decide('granted', 'denied')
    assert.strictEqual(result, 'denied')
  })

  it('administrator granted when clearance requires moderator (higher role satisfies lower requirement)', () => {
    const result = Access.the(makeUser({ role: 'administrator' })).hasClearance('moderator').decide('granted', 'denied')
    assert.strictEqual(result, 'granted')
  })

  it('administrator denied when clearance requires developer', () => {
    const result = Access.the(makeUser({ role: 'administrator' })).hasClearance('developer').decide('granted', 'denied')
    assert.strictEqual(result, 'denied')
  })

  it('developer granted when clearance requires developer', () => {
    const result = Access.the(makeUser({ role: 'developer' })).hasClearance('developer').decide('granted', 'denied')
    assert.strictEqual(result, 'granted')
  })

  it('owner granted for every role requirement', () => {
    const roles = Object.keys(CLEARANCE_LEVEL) as Array<keyof typeof CLEARANCE_LEVEL>
    const access = Access.the(makeUser({ role: 'owner' }))
    roles.forEach(role => {
      const result = access.hasClearance(role).decide('granted', 'denied')
      assert.strictEqual(result, 'granted', `owner should be granted when hasClearance("${role}")`)
    })
  })

  it('works with non-string value types (boolean)', () => {
    const result = Access.the(makeUser({ role: 'moderator' })).hasClearance('moderator').decide(true, false)
    assert.strictEqual(result, true)
  })

  it('works with object value types', () => {
    const granted = { ok: true }
    const denied = { ok: false }
    const result = Access.the(makeUser({ role: 'free' })).hasClearance('moderator').decide(granted, denied)
    assert.strictEqual(result, denied)
  })

  it('works with null as a value', () => {
    const result = Access.the(makeUser({ role: 'free' })).hasClearance('moderator').decide('data', null)
    assert.strictEqual(result, null)
  })

  it('decide() without hasClearance() denies everyone including owner (fail-secure default)', () => {
    // _requiredClearanceLevel defaults to DENY_ALL (8) which is above every role,
    // so forgetting hasClearance() denies even owners.
    assert.strictEqual(DENY_ALL, 8)
    assert.ok(DENY_ALL > CLEARANCE_LEVEL.owner)
    assert.strictEqual(Access.the().decide('granted', 'denied'), 'denied')
    assert.strictEqual(Access.the(makeUser({ role: 'owner' })).decide('granted', 'denied'), 'denied')
  })

  it('calling hasClearance() multiple times uses the most recent value', () => {
    const access = Access.the(makeUser({ role: 'free' }))
    // First sets moderator (denied for free), then overrides with free (granted)
    access.hasClearance('moderator')
    access.hasClearance('free')
    assert.strictEqual(access.decide('granted', 'denied'), 'granted')
  })
})

// ---------------------------------------------------------------------------
// contextualize / applyContext
// ---------------------------------------------------------------------------

describe('Access – contextualize() / applyContext()', () => {
  it('applyContext throws when contextualize has not been called', () => {
    const access = Access.the(makeUser())
    assert.throws(
      () => access.applyContext(() => {}),
      /State or path is not defined/
    )
  })

  it('applyContext invokes handler with correct parent and value', () => {
    const access = Access.the(makeUser())
    const state = { user: { name: 'alice' } }
    access.contextualize(state, 'user.name')

    let capturedParent: unknown
    let capturedValue: unknown
    access.applyContext((parent, value) => {
      capturedParent = parent
      capturedValue = value
    })

    assert.deepStrictEqual(capturedParent, { name: 'alice' })
    assert.strictEqual(capturedValue, 'alice')
  })

  it('applyContext throws when path does not exist in state', () => {
    const access = Access.the(makeUser())
    const state = { user: { name: 'alice' } }
    access.contextualize(state, 'user.nonexistent.deep')

    assert.throws(
      () => access.applyContext(() => {}),
      /Failed to apply context handler/
    )
  })

  it('applyContext throws when path resolves to undefined value', () => {
    const access = Access.the(makeUser())
    const state = { a: { b: undefined } }
    access.contextualize(state, 'a.b')

    assert.throws(
      () => access.applyContext(() => {}),
      /Failed to apply context handler/
    )
  })

  it('contextualize returns the Access instance for chaining', () => {
    const access = Access.the(makeUser())
    const result = access.contextualize({}, 'some.path')
    assert.strictEqual(result, access)
  })

  it('applyContext works on array paths', () => {
    const access = Access.the(makeUser())
    const state = { items: ['a', 'b', 'c'] }
    access.contextualize(state, 'items.1')

    let capturedValue: unknown
    access.applyContext((_parent, value) => {
      capturedValue = value
    })
    assert.strictEqual(capturedValue, 'b')
  })

  it('re-using contextualize overrides previous state and path', () => {
    const access = Access.the(makeUser())
    const state1 = { x: 'first' }
    const state2 = { y: 'second' }
    access.contextualize(state1, 'x')
    access.contextualize(state2, 'y')

    let capturedValue: unknown
    access.applyContext((_parent, value) => {
      capturedValue = value
    })
    assert.strictEqual(capturedValue, 'second')
  })
})

// ---------------------------------------------------------------------------
// Clearance level ordering sanity check
// ---------------------------------------------------------------------------

describe('CLEARANCE_LEVEL ordering', () => {
  it('guest < free < supporter < moderator < administrator < developer < owner', () => {
    const { guest, free, supporter, moderator, administrator, developer, owner } = CLEARANCE_LEVEL
    assert.ok(guest < free)
    assert.ok(free < supporter)
    assert.ok(supporter < moderator)
    assert.ok(moderator < administrator)
    assert.ok(administrator < developer)
    assert.ok(developer <= owner)
  })

  it('patron equals moderator clearance', () => {
    assert.strictEqual(CLEARANCE_LEVEL.patron, CLEARANCE_LEVEL.moderator)
  })

  it('sponsor equals administrator clearance', () => {
    assert.strictEqual(CLEARANCE_LEVEL.sponsor, CLEARANCE_LEVEL.administrator)
  })

  it('owner equals investor equals donor', () => {
    assert.strictEqual(CLEARANCE_LEVEL.owner, CLEARANCE_LEVEL.investor)
    assert.strictEqual(CLEARANCE_LEVEL.owner, CLEARANCE_LEVEL.donor)
  })
})
