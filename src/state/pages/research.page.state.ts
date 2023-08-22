import Config from 'src/config'
import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'
import { FastifySessionObject } from '@fastify/session'

const items: Required<IStatePage>['appBar']['items'] = []
const session = Config.read<FastifySessionObject>('session')
if (session && !session.authenticated) {
  items.push({
    'has': {
      'text': 'Login',
      'route': 'login'
    }
  })
}

const researchPageJson: IStatePage = {
  'content': '$webapp : tubeResearcher',
  // 'hideDrawer': true,
  'appBar': {
    'appBarStyle': 'middle_search',
    items,
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
  },
  'layout': 'layout_none_no_appbar'
}

export default researchPageJson