// Re-export all shared types
export * from './types';
export * from './ui-types';

// Export specific types with T prefix for consistency
export type {
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
  IFormChoices as TFormChoices,
  INetState as TNetState,
  IThemeOptions as TThemeOptions,
  IBootstrapResponse,
  TPlatform,
  IStateMapEntry,
  IStateMap,
  TThemeMode,
  TEndpoint,
  IJsonapiQuerystring,
  TObj,
  WithRequired,
  TOptional,
  IMPV2Doc,
  IAggregateDoc
} from './types';

// Export UI types with T prefix
export type {
  IStateComponent as TStateComponent,
  IStateBackground as TStateBackground,
  IStateLink as TStateLink,
  IStateTypography as TStateTypography,
  IStateFormItem as TStateFormItem,
  IStateFormItemAdornment as TStateFormItemAdornment,
  IStateFormItemInputProps as TStateFormItemInputProps,
  IStateFormItemCustom as TStateFormItemCustom,
  IStateFormItemGroup as TStateFormItemGroup,
  IStateFormItemSelectOption as TStateFormItemSelectOption,
  IStateFormItemCheckboxBox as TStateFormItemCheckboxBox,
  IStateFormItemRadioButton as TStateFormItemRadioButton,
  IStateFormItemSwitchToggle as TStateFormItemSwitchToggle,
  TStateFormItemType as TTStateFormItemType,
  IStateForm as TStateForm,
  IStateDialog as TStateDialog,
  IStateAppbar as TStateAppbar,
  IStatePageDrawer as TStatePageDrawer,
  IStatePage as TStatePage,
  IStateApp as TStateApp,
  IStateIcon as TStateIcon,
  IStateAllPages as TStateAllPages,
  IStateAllForms as TStateAllForms,
  IStateAllDialogs as TStateAllDialogs,
  IStateAllIcons as TStateAllIcons,
  TItemGroup as TTItemGroup
} from './ui-types';
