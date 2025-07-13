import { TStateAllIcons } from 'src/common.types';
import { TBootstrapState } from '../_state.common.types';

/**
 * @see https://fonts.google.com/icons?selected=Material+Icons+Outlined:light_mode:&icon.size=24&icon.color=%23e3e3e3&icon.style=Outlined
 */
export const bootstrap_icons_state: TBootstrapState<TStateAllIcons> = {

  DEFAULT: () => {

    const icons: TStateAllIcons = {
      'vpn_key': {
        'paths': [
          { 'd': 'M0 0h24v24H0z', 'fill': 'none' },
          { 'd': 'M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z' }
        ],
        'fill': 'currentColor',
        'viewBox': '0 0 24 24',
        'height': 24,
        'width': 24
      },
      'alternate_email_outline': {
        'paths': [
          { 'd': 'M0 0h24v24H0z', 'fill': 'none' },
          { 'd': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10h5v-2h-5c-4.34 0-8-3.66-8-8s3.66-8 8-8 8 3.66 8 8v1.43c0 .79-.71 1.57-1.5 1.57s-1.5-.78-1.5-1.57V12c0-2.76-2.24-5-5-5s-5 2.24-5 5 2.24 5 5 5c1.38 0 2.64-.56 3.54-1.47.65.89 1.77 1.47 2.96 1.47 1.97 0 3.5-1.6 3.5-3.57V12c0-5.52-4.48-10-10-10zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z' }
        ],
        'fill': 'currentColor',
        'viewBox': '0 0 24 24',
        'height': 24,
        'width': 24
      },
      'search_outline': {
        'paths': [
          { 'd': 'M0 0h24v24H0z', 'fill': 'none' },
          { 'd': 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' }
        ],
        'fill': 'currentColor',
        'viewBox': '0 0 24 24',
        'height': 24,
        'width': 24
      },
      'filter_none_outline': {
        'paths': [
          { 'd': 'M0 0h24v24H0z', 'fill': 'none' },
          { 'd': 'M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16H7V3h14v14z' }
        ],
        'fill': 'currentColor',
        'viewBox': '0 0 24 24',
        'height': 24,
        'width': 24
      },
      'dark_mode_outline': {
        'paths': [
          { 'd': 'M9.37,5.51C9.19,6.15,9.1,6.82,9.1,7.5c0,4.08,3.32,7.4,7.4,7.4c0.68,0,1.35-0.09,1.99-0.27C17.45,17.19,14.93,19,12,19 c-3.86,0-7-3.14-7-7C5,9.07,6.81,6.55,9.37,5.51z M12,3c-4.97,0-9,4.03-9,9s4.03,9,9,9s9-4.03,9-9c0-0.46-0.04-0.92-0.1-1.36 c-0.98,1.37-2.58,2.26-4.4,2.26c-2.98,0-5.4-2.42-5.4-5.4c0-1.81,0.89-3.42,2.26-4.4C12.92,3.04,12.46,3,12,3L12,3z' }
        ],
        'enableBackground': 'new 0 0 24 24',
        'rects': [
          {
            'fill': 'none',
            'height': 24,
            'width': 24
          }
        ],
        'fill': 'currentColor',
        'viewBox': '0 0 24 24',
        'height': 24,
        'width': 24
      },
      'wb_sunny_outline': {
        'paths': [
          { 'd': 'M0 0h24v24H0V0z', 'fill': 'none' },
          { 'd': 'M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79zM1 10.5h3v2H1zM11 .55h2V3.5h-2zm8.04 2.495l1.408 1.407-1.79 1.79-1.407-1.408zm-1.8 15.115l1.79 1.8 1.41-1.41-1.8-1.79zM20 10.5h3v2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm-1 4h2v2.95h-2zm-7.45-.96l1.41 1.41 1.79-1.8-1.41-1.41z' }
        ],
        'fill': 'currentColor',
        'viewBox': '0 0 24 24',
        'height': 24,
        'width': 24
      },
      'public_outline': {
        'paths': [
          { 'd': 'M0 0h24v24H0V0z', 'fill': 'none' },
          { 'd': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-.61.08-1.21.21-1.78L8.99 15v1c0 1.1.9 2 2 2v1.93C7.06 19.43 4 16.07 4 12zm13.89 5.4c-.26-.81-1-1.4-1.9-1.4h-1v-3c0-.55-.45-1-1-1h-6v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41C17.92 5.77 20 8.65 20 12c0 2.08-.81 3.98-2.11 5.4z' }
        ],
        'fill': 'currentColor',
        'viewBox': '0 0 24 24',
        'height': 24,
        'width': 24
      },
      'filter_list_outline': {
        'paths': [
          { 'd': 'M0 0h24v24H0V0z', 'fill': 'none' },
          { 'd': 'M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z' }
        ],
        'fill': 'currentColor',
        'viewBox': '0 0 24 24',
        'height': 24,
        'width': 24
      },
      'arrow_forward_ios_outline': {
        'paths': [
          { 'd': 'M0,0h24v24H0V0z', 'fill': 'none', 'g': true },
        ],
        'fill': 'currentColor',
        'viewBox': '0 0 24 24',
        'height': 24,
        'width': 24,
        'enableBackground': 'new 0 0 24 24',
        'polygons': [
          {
            'points': '6.23,20.23 8,22 18,12 8,2 6.23,3.77 14.46,12',
            'g': true
          }
        ]
      },
      'power_settings_new_outline': {
        'paths': [
          { 'd': 'M0 0h24v24H0V0z', 'fill': 'none' },
          { 'd': 'M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z' }
        ],
        'fill': 'currentColor',
        'viewBox': '0 0 24 24',
        'height': 24,
        'width': 24
      },
      'playlist_add_outline': {
        'paths': [
          { 'd': 'M14,10H3v2h11V10z M14,6H3v2h11V6z M18,14v-4h-2v4h-4v2h4v4h2v-4h4v-2H18z M3,16h7v-2H3V16z', 'g': true }
        ],
        'fill': 'currentColor',
        'viewBox': '0 0 24 24',
        'height': 24,
        'width': 24,
        'enableBackground': 'new 0 0 24 24',
        'rects': [
          {
            'fill': 'none',
            'height': 24,
            'width': 24,
            'g': true
          }
        ]
      },
      'light_mode_outline': {
        'paths': [
          { 'd': 'M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,7c-2.76,0-5,2.24-5,5s2.24,5,5,5s5-2.24,5-5 S14.76,7,12,7L12,7z M2,13l2,0c0.55,0,1-0.45,1-1s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S1.45,13,2,13z M20,13l2,0c0.55,0,1-0.45,1-1 s-0.45-1-1-1l-2,0c-0.55,0-1,0.45-1,1S19.45,13,20,13z M11,2v2c0,0.55,0.45,1,1,1s1-0.45,1-1V2c0-0.55-0.45-1-1-1S11,1.45,11,2z M11,20v2c0,0.55,0.45,1,1,1s1-0.45,1-1v-2c0-0.55-0.45-1-1-1C11.45,19,11,19.45,11,20z M5.99,4.58c-0.39-0.39-1.03-0.39-1.41,0 c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0s0.39-1.03,0-1.41L5.99,4.58z M18.36,16.95 c-0.39-0.39-1.03-0.39-1.41,0c-0.39,0.39-0.39,1.03,0,1.41l1.06,1.06c0.39,0.39,1.03,0.39,1.41,0c0.39-0.39,0.39-1.03,0-1.41 L18.36,16.95z M19.42,5.99c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06c-0.39,0.39-0.39,1.03,0,1.41 s1.03,0.39,1.41,0L19.42,5.99z M7.05,18.36c0.39-0.39,0.39-1.03,0-1.41c-0.39-0.39-1.03-0.39-1.41,0l-1.06,1.06 c-0.39,0.39-0.39,1.03,0,1.41s1.03,0.39,1.41,0L7.05,18.36z' }
        ],
        'fill': 'currentColor',
        'viewBox': '0 0 24 24',
        'height': 24,
        'width': 24,
        'enableBackground': 'new 0 0 24 24',
        'rects': [
          {
            'fill': 'none',
            'height': 24,
            'width': 24
          }
        ]
      },
      // '': {
      //   'paths': [
      //     { 'd': '', 'fill': 'none' },
      //     { 'd': '' }
      //   ],
      //   'fill': 'currentColor',
      //   'viewBox': '0 0 24 24',
      //   'height': 24,
      //   'width': 24
      // },
    };

    return icons;
  }

  // TODO - If you want to use an icon, insert its state here.
  //        It will then be available client-side.

};
