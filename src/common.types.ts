import { TItemGroup } from '../../tuber-client/src/interfaces/IStateFormItemGroup';
import IFormChoices from '../../tuber-client/src/interfaces/IFormChoices';
import {
  IJsonapiDataAttributes,
  IJsonapiError,
  IJsonapiErrorLinks,
  IJsonapiErrorResponse,
  IJsonapiErrorSource,
  IJsonapiLink,
  IJsonapiPaginationLinks,
  IJsonapiResource,
  IJsonapiResourceLinkage,
  IJsonapiResponse,
  IJsonapiRequest
} from '../../tuber-client/src/interfaces/IJsonapi';
import { INetState, IThemeOptions } from '../../tuber-client/src/interfaces/IState';
import IStateAllDialogs from '../../tuber-client/src/interfaces/IStateAllDialogs';
import IStateAllForms from '../../tuber-client/src/interfaces/IStateAllForms';
import IStateAllPages from '../../tuber-client/src/interfaces/IStateAllPages';
import IStateApp from '../../tuber-client/src/interfaces/IStateApp';
import IStateAppbar from '../../tuber-client/src/interfaces/IStateAppbar';
import IStateBackground from '../../tuber-client/src/interfaces/IStateBackground';
import IStateComponent from '../../tuber-client/src/interfaces/IStateComponent';
import IStateDialog from '../../tuber-client/src/interfaces/IStateDialog';
import { IStatePageDrawer } from '../../tuber-client/src/interfaces/IStateDrawer';
import IStateForm from '../../tuber-client/src/interfaces/IStateForm';
import IStateFormItem from '../../tuber-client/src/interfaces/IStateFormItem';
import { IStateFormItemAdornment } from '../../tuber-client/src/interfaces/IStateFormItem';
import IStateFormItemCustom from '../../tuber-client/src/interfaces/IStateFormItemCustom';
import { IStateFormItemCheckboxBox } from '../../tuber-client/src/controllers/StateFormItemCheckboxBox';
import IStateFormItemGroup from '../../tuber-client/src/interfaces/IStateFormItemGroup';
import { IStateFormItemInputProps } from '../../tuber-client/src/interfaces/IStateFormItem';
import { IStateFormItemRadioButton } from '../../tuber-client/src/interfaces/IFormChoices';
import IStateFormItemSelectOption from '../../tuber-client/src/interfaces/IStateFormItemSelectOption';
import IStateFormItemSwitchToggle from '../../tuber-client/src/interfaces/IStateFormItemSwitchToggle';
import { TStateFormItemType } from '../../tuber-client/src/interfaces/IStateFormItem';
import IStateLink from '../../tuber-client/src/interfaces/IStateLink';
import IStatePage from '../../tuber-client/src/interfaces/IStatePage';
import IStateTypography from '../../tuber-client/src/interfaces/IStateTypography';
import IStateAllIcons from '../../tuber-client/src/interfaces/IStateAllIcons';
import IStateIcon from '../../tuber-client/src/interfaces/IStateIcon';

export type TTItemGroup = TItemGroup;
export type TFormChoices = IFormChoices;

/** `INetState` interface imported form client. */
export type TNetState = INetState;
export type TStateApp = IStateApp;
export type TStateAllIcons = IStateAllIcons;
export type TStateAllPages = IStateAllPages;
export type TStateAllForms = IStateAllForms;
export type TStateAllDialogs = IStateAllDialogs;
export type TStatePage = IStatePage;
export type TStateIcon = IStateIcon;
export type TStateAppbar = IStateAppbar;
export type TStatePageDrawer = IStatePageDrawer;
export type TStateDialog<T=any> = IStateDialog<T>;
export type TStateForm = IStateForm;
export type TStateFormItem = IStateFormItem;
export type TStateFormItemAdornment = IStateFormItemAdornment;
export type TStateFormItemCustom<T=any> = IStateFormItemCustom<T>;
export type TStateFormItemCheckboxBox = IStateFormItemCheckboxBox;
export type TStateFormItemGroup = IStateFormItemGroup;
export type TStateFormItemInputProps = IStateFormItemInputProps & Record<string, any>;
export type TStateFormItemRadioButton = IStateFormItemRadioButton;
export type TStateFormItemSelectOption = IStateFormItemSelectOption;
export type TStateFormItemSwitchToggle = IStateFormItemSwitchToggle;
export type TTStateFormItemType = TStateFormItemType;
export type TStateLink<T=any> = IStateLink<T>;
export type TStateBackground = IStateBackground;
export type TStateComponent = IStateComponent;
export type TJsonapiDataAttributes = IJsonapiDataAttributes;
export type TIJsonapiError = IJsonapiError;
export type TJsonapiErrorLinks = IJsonapiErrorLinks;
export type TJsonapiErrorResponse = IJsonapiErrorResponse;
export type TJsonapiErrorSource = IJsonapiErrorSource;
export type TJsonapiRequest<T=TJsonapiDataAttributes> = IJsonapiRequest<T>;
export type TJsonapiLink = IJsonapiLink;
export type TJsonapiPaginationLinks = IJsonapiPaginationLinks;
export type TJsonapiResource<T=TJsonapiDataAttributes> = IJsonapiResource<T>;
export type TJsonapiResourceLinkage = IJsonapiResourceLinkage;
export type TJsonapiResponse = IJsonapiResponse;
export type TStateTypography = IStateTypography;
export type TObj<T=unknown> = Record<string, T>;
export type TThemeOptions = IThemeOptions;

/** @see https://stackoverflow.com/a/69328045/1875859 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

/** Make properties optional */
export type TOptional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

/**
 * Shallow mongoose document type that contains only the _doc property.
 * @see https://mongoosejs.com/docs/api/document.html#document_Document-_doc
 * @deprecated
 */
export interface IMPV2Doc<T=any> { _doc: T; }

/** Shallow aggregate mongoose document that contains _id */
export interface IAggregateDoc {
  _id: string;
  __v: number;
}

/** Names of collection endpoint */
export type TEndpoint = 'users' | 'entries' | 'bookmarks' | 'tags' | 'authorizations';

/** Generic jsonapi query string */
export interface IJsonapiQuerystring {
  'page[number]'?: string;
  'page[size]'?: string;
  'query'?: string;
  'filter[is_published]'?: string;
  'filter[is_active]'?: string;
  'filter[search]'?: string;

  // TODO Add more expected query strings
}

export interface IBootstrapResponse {
  state: TNetState;
  meta: TObj;
}

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

export interface IStateMapEntry<T=any> {
  state: T;
  clearance?: string;
}

export interface IStateMap {
  [entry: string]: IStateMapEntry;
}

export type TThemeMode = 'light' | 'dark';
