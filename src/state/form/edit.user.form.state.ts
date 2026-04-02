import { SxProps } from '@mui/material'
import { EP_ACCOUNT, TStateForm } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { clone_with_descriptors, t } from '../../business.logic'
import { title_centered } from '../html'
import confirmDeleteAccountDialogState from '../dialog/confirm.delete.account.dialog.state'
import STATE_KEY from '../../business.logic/state.key'

const $82 = STATE_KEY['82']

register('state', '82', $82)
/** Form state to edit user account details. @id 82 */
export const editUserFormState: TStateForm = {
  '_id': '82',
  '_key': $82,
  '_type': 'box',
  'props': {
    'sx': { 'p': 3, 'width': 'min(64ch, 100%)' } as SxProps,
  },
  'paperBackground': true,
  'paperProps': { 'elevation': 12, 'sx': { 'm': 4, 'width': 'min(64ch, calc(100vw - 2rem))' } },
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'html',
          'has': {
            get 'content'() {
              return title_centered(t('edit_account', 'Edit Account'))
            }
          }
        },
        {
          'type': 'html',
          'has': {
            get 'content'() {
              return `<p>${t('edit_account_summary', 'Manage your profile details here. Patreon linking stays separate from profile edits, but both live on this page.')}</p>`
            }
          }
        },
        {
          'type': 'hr'
        },
        {
          'type': 'html',
          'has': {
            get 'content'() {
              return `<h2>${t('profile_details', 'Profile Details')}</h2><p>${t('profile_details_help', 'Update the information associated with your account.')}</p>`
            }
          }
        },
        {
          'type': 'textfield',
          'name': 'name',
          get 'label'() { return t('username', 'Username') },
          'props': {
            'fullWidth': true,
            'autoComplete': 'username'
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('no_username', 'A username is required.') },
            'validationRegex': '^[a-zA-Z0-9_-]{3,21}$',
            get 'validationMessage'() { return t('invalid_username', 'Username must be 3-21 characters long and contain only letters, numbers, underscores, and hyphens.') }
          }
        },
        {
          'type': 'textfield',
          'name': 'firstname',
          get 'label'() { return t('firstname', 'First Name') },
          'props': {
            'fullWidth': true,
            'autoComplete': 'given-name'
          },
          'has': {
            'validationRegex': '^[a-zA-Z\\s\\-\']{0,21}$',
            get 'validationMessage'() { return t('invalid_firstname', 'First name must be 1-21 characters and contain only letters, spaces, hyphens, and apostrophes.') }
          }
        },
        {
          'type': 'textfield',
          'name': 'lastname',
          get 'label'() { return t('last_name', 'Last Name') },
          'props': {
            'fullWidth': true,
            'autoComplete': 'family-name'
          },
          'has': {
            'validationRegex': '^[a-zA-Z\\s\\-\']{0,21}$',
            get 'validationMessage'() { return t('invalid_lastname', 'Last name must be 1-21 characters and contain only letters, spaces, hyphens, and apostrophes.') }
          }
        },
        {
          'type': 'textfield',
          'name': 'email',
          get 'label'() { return t('email', 'Email') },
          'props': {
            'fullWidth': true,
            'autoComplete': 'email',
            'type': 'email'
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('no_email', 'Email is required.') },
            'validationRegex': '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            get 'validationMessage'() { return t('invalid_email', 'Please enter a valid email address.') }
          }
        },
        {
          'type': 'textfield',
          'name': 'phone',
          get 'label'() { return t('phone', 'Phone') },
          'props': {
            'fullWidth': true,
            'autoComplete': 'tel',
            'type': 'tel'
          }
        },
        {
          'type': 'hr'
        },
        {
          'type': 'html',
          'has': {
            get 'content'() {
              return `<h2>${t('patreon', 'Patreon')}</h2><p>${t('patreon_connect_help', 'Link your Patreon account with OAuth. The linkage should be stored from the Patreon user ID returned by Patreon, never from a manually typed email or account ID.')}</p>`
            }
          }
        },
        {
          'type': 'box',
          'props': {
            'sx': {
              'border': '1px solid',
              'borderColor': 'divider',
              'borderRadius': 2,
              'p': 2
            }
          },
          'items': [
            {
              'type': 'stack',
              'props': { 'spacing': 2 },
              'items': [
                {
                  'type': 'html',
                  'has': {
                    get 'content'() {
                      return `
                        <p><strong>${t('patreon_status', 'Status')}:</strong> ${t('patreon_not_connected', 'Not connected')}</p>
                        <p>${t('patreon_section_summary', 'When connected, this section can display the Patreon creator name and current tier. If a token expires, the primary action should switch to reconnecting the account.')}</p>
                        <p>${t('patreon_replace_safety', 'If a Patreon account is already linked, confirm before replacing it with a new connection.')}</p>
                      `
                    }
                  }
                },
                {
                  'type': 'state_button',
                  'has': {
                    get 'label'() { return t('connect_patreon', 'Connect Patreon') },
                    'icon': 'link',
                    'iconPosition': 'left',
                    'onclickHandler': 'tuberCallbacks.openPatreonUpgrade'
                  },
                  'props': {
                    'variant': 'contained',
                    'color': 'primary'
                  }
                }
              ]
            }
          ]
        },
        {
          'type': 'submit',
          'has': {
            'icon': 'save',
            'iconPosition': 'right',
            get 'title'() { return t('save_changes', 'Save Changes') },
            'onclickHandlerDirective': {
              'type': '$form',
              'formName': $82,
              'endpoint': EP_ACCOUNT,
              'rules': [ 'disable_on_submit' ]
            }
          },
          'props': {
            'variant': 'contained',
            'color': 'primary'
          }
        },
        {
          'type': 'state_button',
          'has': {
            get 'label'() { return t('delete_account', 'Delete Account') },
            'icon': 'delete',
            'iconPosition': 'left',
            'onclickHandlerDirective': {
              'type': '$redux_actions',
              'actions': [
                {
                  'type': 'dialog/dialogOpenOrMount',
                  'payload': confirmDeleteAccountDialogState
                }
              ]
            }
          },
          'props': {
            'variant': 'outlined',
            'color': 'error'
          }
        }
      ]
    }
  ],
  'hydrateFromServer': true,
  'hydrationEndpoint': EP_ACCOUNT,
  'disableOnHydration': true
}

export const $82DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(editUserFormState)
  return base
})()

export default editUserFormState