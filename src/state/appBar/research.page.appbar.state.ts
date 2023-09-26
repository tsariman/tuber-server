import IStateAppBar from '../../../../tuber-client/src/controllers/interfaces/IStateAppBar'

const researchPageAppBarJson: IStateAppBar = {
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
    'inputProps': { 'aria-label': 'Search Annotations' },
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
      'onclickHandle': 'tuberCallbacks.appBarSearchForAnnotations'
    }
  },
  'searchFieldIconButtonProps': {
    'aria-label': 'load video url'
  }
}

export default researchPageAppBarJson