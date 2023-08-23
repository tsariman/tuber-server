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
    'placeholder': 'Paste Video URL Here ...',
    'inputProps': { 'aria-label': 'Video URL' },
  },
  'searchFieldIcon': {
    'icon': 'alternate_email_outline',
    'iconProps': {
      'sx': { 'color': 'grey.500' }
    }
  },
  'searchFieldIconButton': {
    'has': {
      'icon': 'playlist_add_outline',
      'handle': 'onclick : tuberCallbacks.noteAddFromUrl'
    }
  },
  'searchFieldIconButtonProps': {
    'aria-label': 'load video url'
  }
}

export default researchPageAppBarJson