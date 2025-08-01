// Re-export all shared types
// export * from './types';
// export * from './ui-types';

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
} from './interfaces/IJsonapi';
export { default as TAbstractState } from './interfaces/IAbstractState';
export { default as TFormChoices } from './interfaces/IFormChoices';
export { default as TSelectProps } from './interfaces/ISelectProps';
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
} from './interfaces/IState';
export { default as TStateAllDialogs } from './interfaces/IStateAllDialogs';
export { default as TStateAllForms } from './interfaces/IStateAllForms';
export { default as TStateAllIcons } from './interfaces/IStateAllIcons';
export { default as TStateAllPages } from './interfaces/IStateAllPages';
export { default as TStateAnchorOrigin } from './interfaces/IStateAnchorOrigin';
export { default as TStateApp } from './interfaces/IStateApp';
export { default as TStateAppbar } from './interfaces/IStateAppbar';
export { default as TStateAppbarQueries } from './interfaces/IStateAppbarQueries';
export { default as TStateAvatar } from './interfaces/IStateAvatar';
export { default as TStateBackground } from './interfaces/IStateBackground';
export { default as TStateCard } from './interfaces/IStateCard';
export { default as TStateComponent } from './interfaces/IStateComponent';
export { default as TStateDialog } from './interfaces/IStateDialog';
export { default as TStateDrawer } from './interfaces/IStateDrawer';
export { default as TStateForm } from './interfaces/IStateForm';
export { default as TStateFormItem } from './interfaces/IStateFormItem';
export { default as TStateFormItemCustom } from './interfaces/IStateFormItemCustom';
export { default as TStateFormItemGroup } from './interfaces/IStateFormItemGroup';
export { default as TStateFormItemSelect } from './interfaces/IStateFormItemSelect';
export { default as TStateFormItemSelectOption } from './interfaces/IStateFormItemSelectOption';
export { default as TStateFormItemSwitchToggle } from './interfaces/IStateFormItemSwitchToggle';
export { default as TStateFormSelect } from './interfaces/IStateFormSelect';
export { default as TStateFormSelectOption } from './interfaces/IStateFormSelectOption';
export { default as TStateFormItemCheckboxBox } from './interfaces/IStateFormItemCheckboxBox';
export { default as TStateIcon } from './interfaces/IStateIcon';
export { default as TStateLink } from './interfaces/IStateLink';
export { default as TStateNet } from './interfaces/IStateNet';
export { default as TStatePage } from './interfaces/IStatePage';
export { IStateSession as TStateSession } from './interfaces/IStateSession';
export { default as TStateSnackbar } from './interfaces/IStateSnackbar';
export { default as TStateTopLevelLinks } from './interfaces/IStateTopLevelLinks';
export { default as TStateTypography } from './interfaces/IStateTypography';
export {
  IJsonapiPageLinks as TJsonapiPageLinks
} from './interfaces/IJsonapi';

// Export specific types with T prefix for consistency
// export type {
//   IJsonapiDataAttributes as TJsonapiDataAttributes,
//   IJsonapiError as TIJsonapiError,
//   IJsonapiErrorLinks as TJsonapiErrorLinks,
//   IJsonapiErrorResponse as TJsonapiErrorResponse,
//   IJsonapiErrorSource as TJsonapiErrorSource,
//   IJsonapiRequest as TJsonapiRequest,
//   IJsonapiLink as TJsonapiLink,
//   IJsonapiPaginationLinks as TJsonapiPaginationLinks,
//   IJsonapiResource as TJsonapiResource,
//   IJsonapiResourceLinkage as TJsonapiResourceLinkage,
//   IJsonapiResponse as TJsonapiResponse,
//   IFormChoices as TFormChoices,
//   INetState as TNetState,
//   IThemeOptions as TThemeOptions,
//   IBootstrapResponse,
//   TPlatform,
//   IStateMapEntry,
//   IStateMap,
//   TThemeMode,
//   TEndpoint,
//   IJsonapiQuerystring,
//   TObj,
//   WithRequired,
//   TOptional,
//   IMPV2Doc,
//   IAggregateDoc
// } from './types';

// Export UI types with T prefix
// export type {
//   IStateComponent as TStateComponent,
//   IStateBackground as TStateBackground,
//   IStateLink as TStateLink,
//   IStateTypography as TStateTypography,
//   IStateFormItem as TStateFormItem,
//   IStateFormItemAdornment as TStateFormItemAdornment,
//   IStateFormItemInputProps as TStateFormItemInputProps,
//   IStateFormItemCustom as TStateFormItemCustom,
//   IStateFormItemGroup as TStateFormItemGroup,
//   IStateFormItemSelectOption as TStateFormItemSelectOption,
//   IStateFormItemCheckboxBox as TStateFormItemCheckboxBox,
//   IStateFormItemRadioButton as TStateFormItemRadioButton,
//   IStateFormItemSwitchToggle as TStateFormItemSwitchToggle,
//   TStateFormItemType as TTStateFormItemType,
//   IStateForm as TStateForm,
//   IStateDialog as TStateDialog,
//   IStateAppbar as TStateAppbar,
//   IStatePageDrawer as TStatePageDrawer,
//   IStatePage as TStatePage,
//   IStateApp as TStateApp,
//   IStateIcon as TStateIcon,
//   IStateAllPages as TStateAllPages,
//   IStateAllForms as TStateAllForms,
//   IStateAllDialogs as TStateAllDialogs,
//   IStateAllIcons as TStateAllIcons,
//   TItemGroup as TTItemGroup
// } from './ui-types';
