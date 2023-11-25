# Development note
There are two version of each form state. The first version is used when the app theme is set to `light` mode. And the second, when it is set to `dark` mode. e.g.
```ts

// FIRST VERSION
/** Development shortcuts form. @id 47 */
const devInstallFormState: TStateForm = {
  '_type': 'box',
  '_id': '47',
  '_key': C.$47_KEY,
  'props': { 'p': 2, 'mt': 10 },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': { 'backgroundColor': C.THEME_LIGHT_PAPER_COLOR }
  },
  'items': [] // contains form items.
}

// SECOND VERSION
/** Dark theme version for the development shortcuts form. */
export const $47DarkThemeMode = {
  ...devInstallFormState,
  'paperProps': {
    'elevation': 0,
    'sx': { 'backgroundColor': C.THEME_DARK_PAPER_COLOR }
  },
} as TStateForm
```
This was done so that if there's a need to apply CSS colors to the form state directly, there's a form state with colors when the theme is in light and dark mode.  
So, when applying color to your form state, do so for both the light and dark theme mode.