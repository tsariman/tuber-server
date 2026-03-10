import { describe, it } from 'node:test'
import assert from 'node:assert'
import EditDailyBookmarkFormState from '../../../src/state/form/edit.daily.bookmark.form.state'
import { $77OnchangeHandlerDirective } from '../../../src/state/form/_state.form.common.logic'
import { TContextualUser } from '../../../src/schema/user'
import { $20_STATE_KEY, TStateForm } from '@tuber/shared'

// Helper to create mock contextual user
function createMockUser(role: TContextualUser['role'], id = '507f1f77bcf86cd799439011'): TContextualUser {
  return {
    _id: id,
    name: 'testuser',
    jwt_version: 0,
    role
  } as TContextualUser
}

// Helper to extract switch item from form state
function getSwitchItem(formState: TStateForm) {
  const stack = formState.items?.[0]
  if (stack?.type !== 'stack') {
    throw new Error('Expected first item to be a stack')
  }
  return stack.items?.[3]
}

describe('edit.daily.bookmark.form.state', () => {
  describe('get_contextualized_edit_daily_bookmark_form_state (light theme)', () => {
    describe('form structure', () => {
      it('should return a form state with _id "20"', () => {
        const formState = EditDailyBookmarkFormState.withContext().light
        assert.strictEqual(formState._id, '20')
      })

      it('should have correct _key', () => {
        const formState = EditDailyBookmarkFormState.withContext().light
        assert.strictEqual(formState._key, $20_STATE_KEY)
      })

      it('should have a stack as the first item', () => {
        const formState = EditDailyBookmarkFormState.withContext().light
        assert.strictEqual(formState.items?.[0]?.type, 'stack')
      })

      it('should have 4 items in the main stack', () => {
        const formState = EditDailyBookmarkFormState.withContext().light
        const stack = formState.items?.[0]
        assert.strictEqual(stack?.type, 'stack')
        assert.strictEqual(stack?.items?.length, 4)
      })

      it('should have start_seconds, videoid, and platform fields in the first row', () => {
        const formState = EditDailyBookmarkFormState.withContext().light
        const stack = formState.items?.[0]
        const rowStack = stack?.items?.[0]
        assert.strictEqual(rowStack?.type, 'stack')
        assert.strictEqual(rowStack?.items?.length, 3)
        assert.strictEqual(rowStack?.items?.[0]?.name, 'start_seconds')
        assert.strictEqual(rowStack?.items?.[1]?.name, 'videoid')
        assert.strictEqual(rowStack?.items?.[2]?.name, 'platform')
      })

      it('should have title field', () => {
        const formState = EditDailyBookmarkFormState.withContext().light
        const stack = formState.items?.[0]
        assert.strictEqual(stack?.items?.[1]?.name, 'title')
        assert.strictEqual(stack?.items?.[1]?.type, 'textfield')
      })

      it('should have note field', () => {
        const formState = EditDailyBookmarkFormState.withContext().light
        const stack = formState.items?.[0]
        assert.strictEqual(stack?.items?.[2]?.name, 'note')
        assert.strictEqual(stack?.items?.[2]?.type, 'textarea')
      })

      it('should have is_published field', () => {
        const formState = EditDailyBookmarkFormState.withContext().light
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.name, 'is_published')
      })
    })

    describe('when user is undefined (guest)', () => {
      it('should change switch to switch_dummy', () => {
        const formState = EditDailyBookmarkFormState.withContext(undefined).light
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_dummy')
      })

      it('should set onchangeHandlerDirective', () => {
        const formState = EditDailyBookmarkFormState.withContext(undefined).light
        const switchItem = getSwitchItem(formState)
        assert.deepStrictEqual(switchItem?.has?.onchangeHandlerDirective, $77OnchangeHandlerDirective)
      })
    })

    describe('when user has role "guest"', () => {
      it('should change switch to switch_dummy', () => {
        const user = createMockUser('guest')
        const formState = EditDailyBookmarkFormState.withContext(user).light
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_dummy')
      })

      it('should set onchangeHandlerDirective', () => {
        const user = createMockUser('guest')
        const formState = EditDailyBookmarkFormState.withContext(user).light
        const switchItem = getSwitchItem(formState)
        assert.deepStrictEqual(switchItem?.has?.onchangeHandlerDirective, $77OnchangeHandlerDirective)
      })
    })

    describe('when user has role "free"', () => {
      it('should change switch to switch_dummy', () => {
        const user = createMockUser('free')
        const formState = EditDailyBookmarkFormState.withContext(user).light
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_dummy')
      })

      it('should set onchangeHandlerDirective for publishing unavailable dialog', () => {
        const user = createMockUser('free')
        const formState = EditDailyBookmarkFormState.withContext(user).light
        const switchItem = getSwitchItem(formState)
        assert.deepStrictEqual(switchItem?.has?.onchangeHandlerDirective, $77OnchangeHandlerDirective)
      })

      it('should preserve the label', () => {
        const user = createMockUser('free')
        const formState = EditDailyBookmarkFormState.withContext(user).light
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.label, 'Published')
      })
    })

    describe('when user has role "supporter" (can publish)', () => {
      it('should keep switch as switch_single', () => {
        const user = createMockUser('supporter')
        const formState = EditDailyBookmarkFormState.withContext(user).light
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_single')
      })

      it('should not set onchangeHandlerDirective', () => {
        const user = createMockUser('supporter')
        const formState = EditDailyBookmarkFormState.withContext(user).light
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.has?.onchangeHandlerDirective, undefined)
      })
    })

    describe('when user has role "member" (can publish)', () => {
      it('should keep switch as switch_single', () => {
        const user = createMockUser('member')
        const formState = EditDailyBookmarkFormState.withContext(user).light
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_single')
      })
    })

    describe('when user has role "patron" (can publish)', () => {
      it('should keep switch as switch_single', () => {
        const user = createMockUser('patron')
        const formState = EditDailyBookmarkFormState.withContext(user).light
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_single')
      })
    })

    describe('when user has role "moderator" (can publish)', () => {
      it('should keep switch as switch_single', () => {
        const user = createMockUser('moderator')
        const formState = EditDailyBookmarkFormState.withContext(user).light
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_single')
      })
    })

    describe('when user has role "administrator" (can publish)', () => {
      it('should keep switch as switch_single', () => {
        const user = createMockUser('administrator')
        const formState = EditDailyBookmarkFormState.withContext(user).light
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_single')
      })
    })

    describe('when user has role "developer" (can publish)', () => {
      it('should keep switch as switch_single', () => {
        const user = createMockUser('developer')
        const formState = EditDailyBookmarkFormState.withContext(user).light
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_single')
      })
    })

    describe('immutability', () => {
      it('should return a new object each time', () => {
        const formState1 = EditDailyBookmarkFormState.withContext().light
        const formState2 = EditDailyBookmarkFormState.withContext().light
        assert.notStrictEqual(formState1, formState2)
      })

      it('should not affect original when modifying returned state', () => {
        const user = createMockUser('free')
        const formState1 = EditDailyBookmarkFormState.withContext(user).light
        formState1._id = 'modified'
        const formState2 = EditDailyBookmarkFormState.withContext(user).light
        assert.strictEqual(formState2._id, '20')
      })
    })
  })

  describe('get_contextualized_edit_daily_bookmark_form_state_dark (dark theme)', () => {
    describe('form structure', () => {
      it('should return a form state with _id "20"', () => {
        const formState = EditDailyBookmarkFormState.withContext().dark
        assert.strictEqual(formState._id, '20')
      })

      it('should have correct _key', () => {
        const formState = EditDailyBookmarkFormState.withContext().dark
        assert.strictEqual(formState._key, $20_STATE_KEY)
      })

      it('should have a stack as the first item', () => {
        const formState = EditDailyBookmarkFormState.withContext().dark
        assert.strictEqual(formState.items?.[0]?.type, 'stack')
      })

      it('should have 4 items in the main stack', () => {
        const formState = EditDailyBookmarkFormState.withContext().dark
        const stack = formState.items?.[0]
        assert.strictEqual(stack?.type, 'stack')
        assert.strictEqual(stack?.items?.length, 4)
      })
    })

    describe('when user is undefined (guest)', () => {
      it('should change switch to switch_dummy', () => {
        const formState = EditDailyBookmarkFormState.withContext(undefined).dark
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_dummy')
      })

      it('should set onchangeHandlerDirective', () => {
        const formState = EditDailyBookmarkFormState.withContext(undefined).dark
        const switchItem = getSwitchItem(formState)
        assert.deepStrictEqual(switchItem?.has?.onchangeHandlerDirective, $77OnchangeHandlerDirective)
      })
    })

    describe('when user has role "guest"', () => {
      it('should change switch to switch_dummy', () => {
        const user = createMockUser('guest')
        const formState = EditDailyBookmarkFormState.withContext(user).dark
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_dummy')
      })

      it('should set onchangeHandlerDirective', () => {
        const user = createMockUser('guest')
        const formState = EditDailyBookmarkFormState.withContext(user).dark
        const switchItem = getSwitchItem(formState)
        assert.deepStrictEqual(switchItem?.has?.onchangeHandlerDirective, $77OnchangeHandlerDirective)
      })
    })

    describe('when user has role "free"', () => {
      it('should change switch to switch_dummy', () => {
        const user = createMockUser('free')
        const formState = EditDailyBookmarkFormState.withContext(user).dark
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_dummy')
      })

      it('should set onchangeHandlerDirective for publishing unavailable dialog', () => {
        const user = createMockUser('free')
        const formState = EditDailyBookmarkFormState.withContext(user).dark
        const switchItem = getSwitchItem(formState)
        assert.deepStrictEqual(switchItem?.has?.onchangeHandlerDirective, $77OnchangeHandlerDirective)
      })

      it('should preserve the label', () => {
        const user = createMockUser('free')
        const formState = EditDailyBookmarkFormState.withContext(user).dark
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.label, 'Published')
      })
    })

    describe('when user has role "supporter" (can publish)', () => {
      it('should keep switch as switch_single', () => {
        const user = createMockUser('supporter')
        const formState = EditDailyBookmarkFormState.withContext(user).dark
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_single')
      })

      it('should not set onchangeHandlerDirective', () => {
        const user = createMockUser('supporter')
        const formState = EditDailyBookmarkFormState.withContext(user).dark
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.has?.onchangeHandlerDirective, undefined)
      })
    })

    describe('when user has role "member" (can publish)', () => {
      it('should keep switch as switch_single', () => {
        const user = createMockUser('member')
        const formState = EditDailyBookmarkFormState.withContext(user).dark
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_single')
      })
    })

    describe('when user has role "patron" (can publish)', () => {
      it('should keep switch as switch_single', () => {
        const user = createMockUser('patron')
        const formState = EditDailyBookmarkFormState.withContext(user).dark
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_single')
      })
    })

    describe('when user has role "moderator" (can publish)', () => {
      it('should keep switch as switch_single', () => {
        const user = createMockUser('moderator')
        const formState = EditDailyBookmarkFormState.withContext(user).dark
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_single')
      })
    })

    describe('when user has role "administrator" (can publish)', () => {
      it('should keep switch as switch_single', () => {
        const user = createMockUser('administrator')
        const formState = EditDailyBookmarkFormState.withContext(user).dark
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_single')
      })
    })

    describe('when user has role "developer" (can publish)', () => {
      it('should keep switch as switch_single', () => {
        const user = createMockUser('developer')
        const formState = EditDailyBookmarkFormState.withContext(user).dark
        const switchItem = getSwitchItem(formState)
        assert.strictEqual(switchItem?.type, 'switch_single')
      })
    })

    describe('immutability', () => {
      it('should return a new object each time', () => {
        const formState1 = EditDailyBookmarkFormState.withContext().dark
        const formState2 = EditDailyBookmarkFormState.withContext().dark
        assert.notStrictEqual(formState1, formState2)
      })

      it('should not affect original when modifying returned state', () => {
        const user = createMockUser('free')
        const formState1 = EditDailyBookmarkFormState.withContext(user).dark
        formState1._id = 'modified'
        const formState2 = EditDailyBookmarkFormState.withContext(user).dark
        assert.strictEqual(formState2._id, '20')
      })
    })
  })

  describe('light vs dark theme consistency', () => {
    it('should have the same _id for both themes', () => {
      const lightState = EditDailyBookmarkFormState.withContext().light
      const darkState = EditDailyBookmarkFormState.withContext().dark
      assert.strictEqual(lightState._id, darkState._id)
    })

    it('should have the same _key for both themes', () => {
      const lightState = EditDailyBookmarkFormState.withContext().light
      const darkState = EditDailyBookmarkFormState.withContext().dark
      assert.strictEqual(lightState._key, darkState._key)
    })

    it('should apply the same access restrictions for free users', () => {
      const user = createMockUser('free')
      const lightState = EditDailyBookmarkFormState.withContext(user).light
      const darkState = EditDailyBookmarkFormState.withContext(user).dark
      
      const lightSwitch = getSwitchItem(lightState)
      const darkSwitch = getSwitchItem(darkState)
      
      assert.strictEqual(lightSwitch?.type, darkSwitch?.type)
      assert.deepStrictEqual(
        lightSwitch?.has?.onchangeHandlerDirective,
        darkSwitch?.has?.onchangeHandlerDirective
      )
    })

    it('should apply the same access restrictions for supporter users', () => {
      const user = createMockUser('supporter')
      const lightState = EditDailyBookmarkFormState.withContext(user).light
      const darkState = EditDailyBookmarkFormState.withContext(user).dark
      
      const lightSwitch = getSwitchItem(lightState)
      const darkSwitch = getSwitchItem(darkState)
      
      assert.strictEqual(lightSwitch?.type, darkSwitch?.type)
      assert.strictEqual(lightSwitch?.type, 'switch_single')
    })
  })
})
