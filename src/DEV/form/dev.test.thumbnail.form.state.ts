import { TBootstrapState } from 'src/state/_state.common.types';
import { TStateForm } from '../../shared';
import { register } from '../../business.logic/registry';
import {
  $45_STATE_KEY,
  $46_STATE_KEY,
  THEME_DARK_PAPER_COLOR,
  THEME_LIGHT_PAPER_COLOR
} from '../../constants.server';
import { clone_with_descriptors } from 'src/business.logic';

register('state', '45', $45_STATE_KEY);
/** @id 45 */
const devTestThumbnailFormState: TStateForm = {
  '_type': 'box',
  '_id': '45',
  '_key': $45_STATE_KEY,
  'props': {
    'sx': { 'p': 2, 'width': 476 },
  },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': { 'backgroundColor': THEME_LIGHT_PAPER_COLOR }
  },
  'items': [
    {
      'type': 'text',
      'name': 'video_url',
      'label': 'Paste Video URL Here ...',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      }
    },
    {
      'type': 'state_button',
      'props': {
        'sx': { 'width': '100%' }
      },
      'has': {
        'label': 'Get Thumbnail',
        'onclickHandle': 'tuberCallbacks.$45_C_1'
      }
    },
    {
      'type': 'html',
      'props': {
        'sx': { 'textAlign': 'center' }
      },
      'has': {
        'content': `
          <img
            src="{{ thumbnailUrl }}"
            style="width: 100%"
            alt="Supposed to load thumbnail of video URL."
          />
        `,
        'key': $46_STATE_KEY
      }
    }
  ]
};

export default devTestThumbnailFormState;

/** @id 45 */
export const $45DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(devTestThumbnailFormState);
  const paperProps = clone_with_descriptors(base.paperProps ?? {});
  paperProps.sx = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_PAPER_COLOR
  };
  base.paperProps = paperProps;
  return base;
})();

export const dev_test_thumbnail_form_state = {

  [$45_STATE_KEY]: devTestThumbnailFormState,

  // TODO - Insert more form states here.

} as TBootstrapState<TStateForm>;

export const dev_test_thumbnail_form_state_dark = {

  [$45_STATE_KEY]: $45DarkThemeMode,

  // TODO - Insert more form states (dark themed) here.

} as TBootstrapState<TStateForm>;
