import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'

const researchPageJson: IStatePage = {
  '_key': 'research-app',
  'content': '$webapp : tubeResearcher',
  // 'hideDrawer': true,
  'appBar': {
    'appBarStyle': 'middle_search',
    'items': [ ],
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
        'icon': 'search_outline',
        'handle': 'onclick : tuberCallbacks.appBarSearchForNotes'
      }
    },
    'searchFieldIconButtonProps': {
      'aria-label': 'load video url'
    }
  },
  'layout': 'layout_none_no_appbar'
}

export default researchPageJson