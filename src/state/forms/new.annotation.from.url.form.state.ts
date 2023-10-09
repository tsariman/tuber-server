import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import IStateFormItem from '../../../../tuber-client/src/controllers/interfaces/IStateFormItem'

const newVideoAnnotationFormJson: IStateForm = {
  '_key': 'newAnnotationFromUrlForm',
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
          'type': 'text',
          'name': 'url',
          'label': 'Paste Video URL Here ...',
          'props': {
            'fullWidth': true,
            'variant': 'filled',
          },
          'inputProps': {
            'end': {
              'icon': {
                'type': 'icon',
                'has': {
                  'icon': 'arrow_forward_ios_outline',
                  'onclickHandle': 'tuberCallbacks.annotationAddFromUrl',
                }
              }
            }
          },
          'has': {
            'onkeydownHandle': 'tuberCallbacks.appBarAddAnnotationOnKeyDown',
          }
        },
      ] as IStateFormItem[]
    }
  ]
}

export default newVideoAnnotationFormJson