import { TNetState } from './shared';

// JSON API Types
export {
  IJsonapiDataAttributes as TJsonapiDataAttributes,
  IJsonapiError as TIJsonapiError,
  IJsonapiErrorLinks as TJsonapiErrorLinks,
  IJsonapiErrorResponse as TJsonapiErrorResponse,
  IJsonapiErrorSource as TJsonapiErrorSource,
  IJsonapiRequest as TJsonapiRequest,
  IJsonapiLink as TJsonapiLink,
  IJsonapiPaginationLinks as TJsonapiPaginationLinks,
  IJsonapiResource as TJsonapiResource,
  IJsonapiResourceLinkage as TJsonapiResourceLinkage,
  IJsonapiResponse as TJsonapiResponse,
} from './shared/interfaces/IJsonapi';


export { default as TAbstractState } from './shared/interfaces/IAbstractState';
export {
  default as TFormChoices,
  IStateFormItemRadioButton as TStateFormItemRadioButton
} from './shared/interfaces/IFormChoices';
export { default as TSelectProps } from './shared/interfaces/ISelectProps';
export {
  ILoadedPagesRange as TLoadedPagesRange,
  IStateData as TStateData,
  IFormItemDataError as TFormItemDataError,
  IStateFormsDataErrors as TStateFormsDataErrors,
  IStatePathnames as TStatePathnames,
  IStateChip as TStateChip,
  default as TState,
  INetState as TNetState,
  IStateFormItemCustomIcon as TStateFormItemCustomIcon,
} from './shared/interfaces/IState';
export { default as TStateAllDialogs } from './shared/interfaces/IStateAllDialogs';
export { default as TStateAllForms } from './shared/interfaces/IStateAllForms';
export { default as TStateAllIcons } from './shared/interfaces/IStateAllIcons';
export { default as TStateAllPages } from './shared/interfaces/IStateAllPages';
export { default as TStateAnchorOrigin } from './shared/interfaces/IStateAnchorOrigin';
export { default as TStateApp } from './shared/interfaces/IStateApp';
export { default as TStateAppbar } from './shared/interfaces/IStateAppbar';
export { default as TStateAppbarQueries } from './shared/interfaces/IStateAppbarQueries';
export { default as TStateAvatar } from './shared/interfaces/IStateAvatar';
export { default as TStateBackground } from './shared/interfaces/IStateBackground';
export { default as TStateCard } from './shared/interfaces/IStateCard';
export { default as TStateComponent } from './shared/interfaces/IStateComponent';
export { default as TStateDialog } from './shared/interfaces/IStateDialog';
export {
  default as TStateDrawer,
  IStatePageDrawer as TStatePageDrawer
} from './shared/interfaces/IStateDrawer';
export { default as TStateForm } from './shared/interfaces/IStateForm';
export {
  default as TStateFormItem,
  IStateFormItemAdornment as TStateFormItemAdornment,
  IStateFormItemInputProps as TStateFormItemInputProps,
  TStateFormItemType
} from './shared/interfaces/IStateFormItem';
export { default as TStateFormItemCustom } from './shared/interfaces/IStateFormItemCustom';
export {
  default as TStateFormItemGroup,
  TItemGroup
} from './shared/interfaces/IStateFormItemGroup';
export { default as TStateFormItemSelect } from './shared/interfaces/IStateFormItemSelect';
export { default as TStateFormItemSelectOption } from './shared/interfaces/IStateFormItemSelectOption';
export { default as TStateFormItemSwitchToggle } from './shared/interfaces/IStateFormItemSwitchToggle';
export { default as TStateFormSelect } from './shared/interfaces/IStateFormSelect';
export { default as TStateFormSelectOption } from './shared/interfaces/IStateFormSelectOption';
export { default as TStateFormItemCheckboxBox } from './shared/interfaces/IStateFormItemCheckboxBox';
export { default as TStateIcon } from './shared/interfaces/IStateIcon';
export { default as TStateLink } from './shared/interfaces/IStateLink';
export { default as TStateNet } from './shared/interfaces/IStateNet';
export { default as TStatePage } from './shared/interfaces/IStatePage';
export { IStateSession as TStateSession } from './shared/interfaces/IStateSession';
export { default as TStateSnackbar } from './shared/interfaces/IStateSnackbar';
export { default as TStateTopLevelLinks } from './shared/interfaces/IStateTopLevelLinks';
export { default as TStateTypography } from './shared/interfaces/IStateTypography';

export type TStateResponse = { 'state': TNetState };

// Utility types
export type TObj<T=unknown> = Record<string, T>;

/** Make properties required. @see https://stackoverflow.com/a/69328045/1875859 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/** Make properties optional. */
export type TOptional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

export interface IAggregateDoc {
  _id: string;
  __v: number;
}

// Mongoose document interfaces
export interface IMPV2Doc<T = unknown> { 
  _doc: T & IAggregateDoc;
}

// Platform types
export type TPlatform = '_blank'
  | 'youtube'
  | 'vimeo'
  | 'dailymotion'
  | 'rumble'
  | 'odysee'
  | 'twitch'
  | 'facebook'
  | 'bitchute'
  | 'unknown';

// Endpoint types
export type TEndpoint = 'users'| 'entries' | 'bookmarks' | 'tags'
| 'authorizations';

/** State map type */
export interface IStateMapEntry<T = unknown> {
  state: T;
  clearance?: string;
}

export interface IStateMap {
  [entry: string]: IStateMapEntry;
}

// Theme types
export type TThemeMode = 'light' | 'dark';

/** Generic JSON API query string */
export interface IJsonapiQuerystring {
  'page[number]'?: string;
  'page[size]'?: string;
  'query'?: string;
  'filter[is_published]'?: string;
  'filter[is_active]'?: string;
  'filter[search]'?: string;
}

/** Bootstrap response */
export interface IBootstrapResponse {
  state: TNetState;
  meta?: Record<string, unknown>; // Make meta optional since it's often not provided
}
