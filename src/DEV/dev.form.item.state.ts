import * as C from '@tuber/shared'

export const devFormItemSeparator: C.TStateFormItem = {
  'type': 'html_tag',
  'has': { 'content': '|' }
}
export const devCreateDevUserStateButton: C.TStateFormItem = {
  'type': 'state_button',
  'has': {
    'label': 'Create dev user',
    // 'onclickHandler': 'tuberCallbacks.devCreateUser',
    'onclickHandlerDirective': { 'type': '$form_none', 'endpoint': 'dev/user' }
  },
}
export const devResetDatabaseStateButton: C.TStateFormItem = {
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
export const devTestDrawerStateButton: C.TStateFormItem = {
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
export const devRemoveDrawerStateButton: C.TStateFormItem = {
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
export const devLinkTestAddNewBookmarkState: C.TStateFormItem = {
  'type': 'a',
  'has': {
    'label': 'Test Add New bookmark',
    'onclickHandler': 'tuberCallbacks.bookmarkAdd'
  }
}
export const devCreateNewUserLinkState: C.TStateFormItem = {
  'type': 'a',
  'has': {
    'label': 'Create new user',
    'onclickHandler': 'tuberCallbacks.devUserAdd'
  }
}
export const devPopulateUserCollection: C.TStateFormItem = {
  'type': 'state_button',
  'has': {
    'label': 'Populate user collection',
    'onclickHandler': 'tuberCallbacks.devUserPopulate'
  }
}
export const devGetBookmarkCollectionTest: C.TStateFormItem = {
  'type': 'state_button',
  'has': {
    'label': 'Get bookmarks collection test',
    'onclickHandler': 'tuberCallbacks.devGetBookmarks'
  }
}
export const devTestSpinner: C.TStateFormItem = {
  'type': 'state_button',
  'has': {
    'label': 'Test spinner',
    'onclickHandler': 'tuberCallbacks.devNoResponse'
  }
}
export const devGetPlatformThumbnailTest: C.TStateFormItem = {
  'type': 'a',
  'has': {
    'label': ' Test getting platform thumbnails ',
    'route': C.$46_STATE_KEY
  }
}
export const devSaveConfigValue: C.TStateFormItem = {
  'type': 'a',
  'has': {
    'label': ' Save config value ',
    'route': C.$61_STATE_KEY
  }
}
export const devEnterTwitchClientId: C.TStateFormItem = {
  'type': 'a',
  'has': {
    'label': ' Enter Twitch Client ID ',
    'route': C.$59_STATE_KEY
  }
}
export const devRumbleRegexpTest: C.TStateFormItem = {
  'type': 'a',
  'has': {
    'label': ' Test rumble regexp ',
    'route': C.$56_STATE_KEY
  }
}
export const devUnknownRegexpTest: C.TStateFormItem = {
  'type': 'a',
  'has': {
    'label': ' Test unknown regexp ',
    'route': C.$58_STATE_KEY
  }
}
export const devFakePageTest: C.TStateFormItem = {
  'type': 'a',
  'has': {
    'label': ' Fake page test ',
    'route': 'i-lead-to-nowhere'
  }
}
export const devDropCollectionSelect: C.TStateFormItem = {
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
export const devDropCollectionButton: C.TStateFormItem = {
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
export const devPopulateCollectionSelect: C.TStateFormItem = {
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
export const devPopulationQuantity: C.TStateFormItem = {
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
export const devPopulateCollectionButton: C.TStateFormItem = {
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
export const devCreateBookmarkSearchIndex: C.TStateFormItem = {
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
export const devHorizontalSeparator: C.TStateFormItem = { 'type': 'hr' }