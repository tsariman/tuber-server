import { TStateForm } from '../../common.types'
import Config from '../../config'
import * as C from '../../constants'

Config.register('state', '47', C.$47_KEY)
/** Development shortcuts form. @id 47 */
const devInstallFormState = {
  '_type': 'box',
  '_id': '47',
  '_key': C.$47_KEY,
  'props': { 'p': 2, 'mt': 10 },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': { 'backgroundColor': '#dddddd' }
  },
  'items': [
    {
      'type': 'html',
      'props': { 'sx': { 'textAlign': 'center' } },
      'has': {
        'content': '<h2>Development Shortcuts</h2>'
      }
    },
    {
      'type': 'html',
      'has': {
        'content': `
          <p>
            <em>Use these shortcuts to quickly test the application.</em>
            <em>These shortcuts are not available in production.</em>
          </p>
          <h3>Collections</h3>
          <p>
            &#128172;<span style="color:#0074d8"><b>Bookmarks</b></span> <em>({{ bookmarkCount }})</em>
            <br />
            &#128526;<span style="color:#0074d8"><b>Users</b></span> <em>({{ userCount }})</em>
          </p>
        `,
        'key': C.$47_KEY
      }
    },
    {
      'type': 'state_button',
      'has': {
        'label': 'Create dev user',
        'onclickHandle': 'tuberCallbacks.devCreateUser'
      },
    },
    {
      'type': 'html_tag',
      'has': { 'content': '|' }
    },
    {
      'type': 'state_button',
      'has': {
        'label': 'Reset database',
        'onclickHandle': 'tuberCallbacks.devResetDatabase'
      }
    },
    {
      'type': 'html_tag',
      'has': { 'content': '|' }
    },
    {
      'type': 'state_button',
      'has': {
        'label': 'Test Drawer',
        'onclickHandle': 'tuberCallbacks.devLoadDrawer'
      }
    },
    {
      'type': 'html_tag',
      'has': { 'content': '|' }
    },
    {
      'type': 'state_button',
      'has': {
        'label': 'Remove Drawer',
        'onclickHandle': 'tuberCallbacks.devUnloadDrawer'
      }
    },
    {
      'type': 'html_tag',
      'has': { 'content': '|' }
    },
    {
      'type': 'a',
      'has': {
        'label': 'Test Add New bookmark',
        'onclickHandle': 'tuberCallbacks.bookmarkAdd'
      }
    },
    { 'type': 'hr' },
    {
      'type': 'stack',
      'props': {
        'direction': 'row',
        'spacing': 1
      },
      'items': [
        {
          'type': 'textfield',
          'name': 'clipboard-test',
          'label': 'Clipboard Test',
          'has': {
            
          },
          'props': {
            'variant': 'filled',
            'fullWidth': true
          }
        },
        {
          'type': 'state_button',
          'has': {
            'text': 'Test Clipboard',
            'onclickHandle': 'tuberCallbacks.devClipboardTest'
          },
          'props': {
            'variant': 'contained',
            'size': 'small',
            'disableElevation': true
          }
        }
      ]
    },
    { 'type': 'hr' },
    {
      'type': 'a',
      'has': {
        'label': 'Create new user',
        'onclickHandle': 'tuberCallbacks.devUserAdd'
      }
    },
    {
      'type': 'html_tag',
      'has': { 'content': '|' }
    },
    {
      'type': 'state_button',
      'has': {
        'label': 'Populate user collection',
        'onclickHandle': 'tuberCallbacks.devUserPopulate'
      }
    },
    {
      'type': 'html_tag',
      'has': { 'content': '|' }
    },
    {
      'type': 'state_button',
      'has': {
        'label': 'Get bookmarks collection test',
        'onclickHandle': 'tuberCallbacks.devGetBookmarks'
      }
    },
    {
      'type': 'html_tag',
      'has': { 'content': '|' }
    },
    {
      'type': 'state_button',
      'has': {
        'label': 'Test spinner',
        'onclickHandle': 'tuberCallbacks.devNoResponse'
      }
    },
    {
      'type': 'html_tag',
      'has': { 'content': '|' }
    },
    {
      'type': 'a',
      'has': {
        'label': ' Test getting platform thumbnails ',
        'route': C.$46_KEY
      }
    },
    {
      'type': 'html_tag',
      'has': { 'content': '|' }
    },
    {
      'type': 'a',
      'has': {
        'label': ' Set authorization key ',
        'route': C.$48_KEY
      }
    },
    {
      'type': 'html_tag',
      'has': { 'content': '|' }
    },
    {
      'type': 'a',
      'has': {
        'label': ' Set authorization url ',
        'route': C.$51_KEY
      }
    },
    {
      'type': 'html_tag',
      'has': { 'content': '|' }
    },
    {
      'type': 'a',
      'has': {
        'label': ' Test rumble regexp ',
        'route': C.$56_KEY
      }
    },
    {
      'type': 'html_tag',
      'has': { 'content': '|' }
    },
    {
      'type': 'a',
      'has': {
        'label': ' Test unknown regexp ',
        'route': C.$58_KEY
      }
    },
    {
      'type': 'html_tag',
      'has': { 'content': '|' }
    },
    {
      'type': 'a',
      'has': {
        'label': ' Visit fake page ',
        'route': 'i-lead-to-nowhere'
      }
    },
    {
      'type': 'html_tag',
      'has': { 'content': '|' }
    },
    {
      'type': 'stack',
      'props': {
        'direction': 'row',
        'spacing': 1
      },
      'items': [
        {
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
        },
        {
          'type': 'state_button',
          'has': {
            'label': 'Drop Collection',
            'onclickHandle': 'tuberCallbacks.devDropCollection'
          },
          'props': {
            'variant': 'contained',
            'size': 'small',
            'disableElevation': true
          }
        },
        {
          'type': 'html_tag',
          'has': { 'content': '|' }
        },
        {
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
        },
        {
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
        },
        {
          'type': 'state_button',
          'has': {
            'label': 'Populate Collection',
            'onclickHandle': 'tuberCallbacks.devPopulateCollection'
          },
          'props': {
            'variant': 'contained',
            'size': 'small',
            'disableElevation': true
          }
        },
        {
          'type': 'html_tag',
          'has': { 'content': '|' }
        },
        {
          'type': 'state_button',
          'has': {
            'label': 'Create Bookmark Search Index',
            'onclickHandle': 'tuberCallbacks.devCreateBookmarkSearchIndex'
          },
          'props': {
            'variant': 'contained',
            'size': 'small',
            'disableElevation': true
          }
        },
      ]
    },
  ]
} as TStateForm

export default devInstallFormState