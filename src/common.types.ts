// Import shared types from our server-compatible shared module
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
  IJsonapiRequest,
  INetState,
  IThemeOptions,
  IFormChoices,
  WithRequired,
  TOptional,
  IMPV2Doc,
  IAggregateDoc,
  TPlatform,
  IStateMapEntry,
  IStateMap,
  TThemeMode,
  TEndpoint,
  IJsonapiQuerystring,
  IBootstrapResponse,
  // UI Types
  IStateComponent,
  IStateBackground,
  IStateLink,
  IStateTypography,
  IStateFormItem,
  IStateFormItemAdornment,
  IStateFormItemInputProps,
  IStateFormItemCustom,
  IStateFormItemGroup,
  IStateFormItemSelectOption,
  IStateFormItemCheckboxBox,
  IStateFormItemRadioButton,
  IStateFormItemSwitchToggle,
  TStateFormItemType,
  IStateForm,
  IStateDialog,
  IStateAppbar,
  IStatePageDrawer,
  IStatePage,
  IStateApp,
  IStateIcon,
  IStateAllPages,
  IStateAllForms,
  IStateAllDialogs,
  IStateAllIcons,
  TItemGroup
} from './shared';

// Export types that are needed by the server
export type TFormChoices = IFormChoices;

/** `INetState` interface imported from shared. */
export type TNetState = INetState; // The flexible version that allows all properties

// JSON API types
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

// Utility types
export type TObj<T=unknown> = Record<string, T>;
export type TThemeOptions = IThemeOptions;

/** @see https://stackoverflow.com/a/69328045/1875859 */
export type { WithRequired };

/** Make properties optional */
export type { TOptional };

// Mongoose types
export type { IMPV2Doc };
export type { IAggregateDoc };

// Platform and endpoint types
export type { TPlatform };
export type { TEndpoint };

// State map types
export type { IStateMapEntry };
export type { IStateMap };

// Theme types
export type { TThemeMode };

// Query types
export type { IJsonapiQuerystring };

// Bootstrap types
export type { IBootstrapResponse };

// UI State types (server-compatible versions)
export type TStateComponent = IStateComponent;
export type TStateBackground = IStateBackground;
export type TStateLink<T=any> = IStateLink<T>;
export type TStateTypography = IStateTypography;
export type TStateFormItem = IStateFormItem;
export type TStateFormItemAdornment = IStateFormItemAdornment;
export type TStateFormItemInputProps = IStateFormItemInputProps;
export type TStateFormItemCustom<T=any> = IStateFormItemCustom<T>;
export type TStateFormItemGroup = IStateFormItemGroup;
export type TStateFormItemSelectOption = IStateFormItemSelectOption;
export type TStateFormItemCheckboxBox = IStateFormItemCheckboxBox;
export type TStateFormItemRadioButton = IStateFormItemRadioButton;
export type TStateFormItemSwitchToggle = IStateFormItemSwitchToggle;
export type TTStateFormItemType = TStateFormItemType;
export type TStateForm = IStateForm;
export type TStateDialog<T=any> = IStateDialog<T>;
export type TStateAppbar = IStateAppbar;
export type TStatePageDrawer = IStatePageDrawer;
export type TStatePage = IStatePage;
export type TStateApp = IStateApp;
export type TStateIcon = IStateIcon;
export type TStateAllPages = IStateAllPages;
export type TStateAllForms = IStateAllForms;
export type TStateAllDialogs = IStateAllDialogs;
export type TStateAllIcons = IStateAllIcons;
export type TTItemGroup = TItemGroup;
