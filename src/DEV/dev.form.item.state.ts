import { TStateFormItem } from '@tuber/shared'
import STATE_KEY from '../business.logic/state.key'

const $46 = STATE_KEY['46']
const $61 = STATE_KEY['61']
const $59 = STATE_KEY['59']
const $56 = STATE_KEY['56']
const $58 = STATE_KEY['58']

export const devFormItemSeparator: TStateFormItem = {
  'type': 'html_tag',
  'has': { 'content': '|' }
}
export const devCreateDevUserStateButton: TStateFormItem = {
  'type': 'state_button',
  'has': {
    'label': 'Create dev user',
    // 'onclickHandler': 'tuberCallbacks.devCreateUser',
    'onclickHandlerDirective': { 'type': '$form_none', 'endpoint': 'dev/user' }
  },
}
export const devResetDatabaseStateButton: TStateFormItem = {
  'type': 'state_button',
  'has': {
    'label': 'Reset database',
    // 'onclickHandler': 'tuberCallbacks.devResetDatabase',
    'onclickHandlerDirective': {
      'type': '$form_none',
      'endpoint': 'dev/database-reset'
    }
  }
}
export const devTestDrawerStateButton: TStateFormItem = {
  'type': 'state_button',
  'has': {
    'label': 'Test Drawer',
    // 'onclickHandler': 'tuberCallbacks.devLoadDrawer',
    'onclickHandlerDirective': {
      'type': '$form_none',
      'endpoint': 'dev/load-test-drawer'
    }
  }
}
export const devRemoveDrawerStateButton: TStateFormItem = {
  'type': 'state_button',
  'has': {
    'label': 'Remove Drawer',
    // 'onclickHandler': 'tuberCallbacks.devUnloadDrawer',
    'onclickHandlerDirective': {
      'type': '$form_none',
      'endpoint': 'dev/unload-test-drawer'
    }
  }
}
export const devLinkTestAddNewBookmarkState: TStateFormItem = {
  'type': 'a',
  'has': {
    'label': 'Test Add New bookmark',
    'onclickHandler': 'tuberCallbacks.bookmarkAdd'
  }
}
export const devCreateNewUserLinkState: TStateFormItem = {
  'type': 'a',
  'has': {
    'label': 'Create new user',
    'onclickHandler': 'tuberCallbacks.devUserAdd'
  }
}
export const devPopulateUserCollection: TStateFormItem = {
  'type': 'state_button',
  'has': {
    'label': 'Populate user collection',
    'onclickHandler': 'tuberCallbacks.devUserPopulate'
  }
}
export const devGetBookmarkCollectionTest: TStateFormItem = {
  'type': 'state_button',
  'has': {
    'label': 'Get bookmarks collection test',
    'onclickHandler': 'tuberCallbacks.devGetBookmarks'
  }
}
export const devTestSpinner: TStateFormItem = {
  'type': 'state_button',
  'has': {
    'label': 'Test spinner',
    'onclickHandler': 'tuberCallbacks.devNoResponse'
  }
}
export const devGetPlatformThumbnailTest: TStateFormItem = {
  'type': 'a',
  'has': {
    'label': ' Test getting platform thumbnails ',
    'route': $46
  }
}
export const devSaveConfigValue: TStateFormItem = {
  'type': 'a',
  'has': {
    'label': ' Save config value ',
    'route': $61
  }
}
export const devEnterTwitchClientId: TStateFormItem = {
  'type': 'a',
  'has': {
    'label': ' Enter Twitch Client ID ',
    'route': $59
  }
}
export const devRumbleRegexpTest: TStateFormItem = {
  'type': 'a',
  'has': {
    'label': ' Test rumble regexp ',
    'route': $56
  }
}
export const devUnknownRegexpTest: TStateFormItem = {
  'type': 'a',
  'has': {
    'label': ' Test unknown regexp ',
    'route': $58
  }
}
export const devFakePageTest: TStateFormItem = {
  'type': 'a',
  'has': {
    'label': ' Fake page test ',
    'route': 'i-lead-to-nowhere'
  }
}
export const devSnackbarTest: TStateFormItem = {
  'type': 'a',
  'has': {
    'label': ' Test Snackbar ',
    'onclickHandlerDirective': {
      'type': '$redux_actions',
      'actions': [{
        'type': 'snackbar/snackbarWriteSuccess',
        'payload': 'This is a success snackbar from dev form!'
      }]
    }
  }
}
export const devDropCollectionSelect: TStateFormItem = {
  'type': 'state_select',
  'name': 'drop-collection',
  'label': 'Drop Collection',
  'props': {
    'variant': 'filled',
    'size': 'lg',
  },
  'has': {
    'formControlProps': {
      'sx': { 'm': 1, 'minWidth': 200 }
    },
    'inputLabelProps': {
      'sx': { 'm': 1 }
    },
    'items': [
      { 'label': 'Bookmarks', 'value': 'bookmarks' },
      { 'label': 'Users', 'value': 'users' }
    ]
  }
}
export const devDropCollectionButton: TStateFormItem = {
  'type': 'state_button',
  'has': {
    'label': 'Drop Collection',
    'onclickHandler': 'tuberCallbacks.devDropCollection'
  },
  'props': {
    'variant': 'contained',
    'size': 'small',
    'disableElevation': true
  }
}
export const devPopulateCollectionSelect: TStateFormItem = {
  'type': 'state_select',
  'name': 'populate-collection',
  'label': 'Populate Collection',
  'props': {
    'variant': 'filled',
    'size': 'lg',
  },
  'has': {
    'formControlProps': {
      'sx': { 'm': 1, 'minWidth': 200 }
    },
    'inputLabelProps': {
      'sx': { 'm': 1 }
    },
    'items': [
      { 'label': 'Bookmarks', 'value': 'bookmarks' },
      { 'label': 'Users', 'value': 'users' }
    ]
  }
}
export const devPopulationQuantity: TStateFormItem = {
  'type': 'state_select',
  'name': 'population-quantity',
  'label': 'Population Quantity',
  'props': {
    'variant': 'filled',
    'size': 'lg',
  },
  'has': {
    'formControlProps': {
      'sx': { 'm': 1, 'minWidth': 200 }
    },
    'inputLabelProps': {
      'sx': { 'm': 1 }
    },
    'items': [
      { 'label': '50', 'value': '50' },
      { 'label': '200', 'value': '200' },
      { 'label': '1000', 'value': '1000' },
      { 'label': '5000', 'value': '5000' },
      { 'label': '20000', 'value': '20000' },
      { 'label': '100000', 'value': '100000' },
      { 'label': '500000', 'value': '500000' }
    ]
  }
}
export const devPopulateCollectionButton: TStateFormItem = {
  'type': 'state_button',
  'has': {
    'label': 'Populate Collection',
    'onclickHandler': 'tuberCallbacks.devPopulateCollection'
  },
  'props': {
    'variant': 'contained',
    'size': 'small',
    'disableElevation': true
  }
}
export const devCreateBookmarkSearchIndex: TStateFormItem = {
  'type': 'state_button',
  'has': {
    'label': 'Create Bookmark Search Index',
    'onclickHandler': 'tuberCallbacks.devCreateBookmarkSearchIndex'
  },
  'props': {
    'variant': 'contained',
    'size': 'small',
    'disableElevation': true
  }
}
export const devHorizontalSeparator: TStateFormItem = { 'type': 'hr' }