import { TStateAppBar } from '../../common.types'

const researchPageAppBarState: TStateAppBar = {
  'appBarStyle': 'middle_search',
  'items': [
    {
      'type': 'icon',
      'has': {
        'icon': 'power_settings_new_outline',
        'route': 'login'
      }
    }
  ],
  'inputBaseProps': {
    'id': 'video-url',
    'placeholder': 'Search ...',
    'inputProps': { 'aria-label': 'Search Bookmarks' },
  },
  'searchFieldIcon': {
    'icon': 'alternate_email_outline',
    'iconProps': {
      'sx': { 'color': 'grey.500' }
    }
  },
  'searchFieldIconButton': {
    'has': {
      'icon': 'search_outline',
      'onclickHandle': 'tuberCallbacks.appBarSearchBookmarks'
    }
  },
  'searchFieldIconButtonProps': {
    'aria-label': 'load video url'
  }
}

export default researchPageAppBarState