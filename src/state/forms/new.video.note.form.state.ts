import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import IStateFormItem from '../../../../tuber-client/src/controllers/interfaces/IStateFormItem'

const newVideoNoteFormJson: IStateForm = {
  '_key': 'newVideoNoteForm',
  'items': [
    {
      'type': 'stack',
      'props': {
        'spacing': 2,
        'sx': {
          'width': '100%'
        }
      },
      'items': [
        {
          'type': 'div',
          'props': {
            'sx': {
              'p': '0 2',
              'height': '100%',
              'position': 'absolute',
              'pointerEvents': 'none',
              'display': 'flex',
              'alignItems': 'center',
              'justifyContent': 'center',
            }
          },
          'items': [
            {
              'type': 'icon',
              'props': {
                'icon': 'search_outline',
                'fontSize': 'large',
                'sx': { 'color': 'grey.500' }
              }
            }
          ]
        },
        {
          'type': 'text',
          'name': 'url',
          'label': 'Video URL',
          'props': { 'fullWidth': true },
          'inputProps': {
            'end': {
              'icon': {
                'type': 'icon',
                'has': {
                  'icon': 'playlist_add_outline',
                  'handle': 'onclick : tuberCallbacks.newVideoNoteDialog',
                }
              }
            }
          }
        },
      ] as IStateFormItem[]
    }
  ]
}

export default newVideoNoteFormJson