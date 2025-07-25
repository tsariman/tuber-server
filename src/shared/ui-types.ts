// Server-compatible UI state types
// These are simplified versions that contain the data structure without client dependencies

export interface IStateComponent {
  id?: string;
  type?: string;
  props?: Record<string, any>;
  children?: IStateComponent[];
  content?: string;
  has?: Record<string, any>;
}

export interface IStateBackground {
  color?: string;
  image?: string;
  position?: string;
  repeat?: string;
  size?: string;
}

export interface IStateLink<T = any> {
  _id?: string;
  _key?: string;
  type?: string;
  text?: string;
  href?: string;
  props?: Record<string, any>;
  data?: T;
  onClick?: string; // function name as string for server
  has?: Record<string, any>;
}

export interface IStateTypography {
  variant?: string;
  color?: string;
  align?: string;
  gutterBottom?: boolean;
  props?: Record<string, any>;
  text?: string;
}

export interface IStateFormItemAdornment {
  position?: 'start' | 'end';
  component?: string;
  props?: Record<string, any>;
  icon?: any;
  text?: string;
  textProps?: any;
}

export interface IStateFormItemInputProps {
  type?: string;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  maxRows?: number;
  readOnly?: boolean;
  end?: Record<string, any>;
  [key: string]: any;
}

export interface IStateFormItem {
  _id?: string;
  _key?: string;
  _type?: string;
  id?: string;
  name?: string;
  label?: string;
  type?: string;
  value?: any;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  error?: boolean;
  props?: Record<string, any>;
  inputProps?: IStateFormItemInputProps;
  adornment?: IStateFormItemAdornment;
  options?: IStateFormItemSelectOption[];
  validation?: Record<string, any>;
  has?: Record<string, any>;
  items?: any[]; // Can contain nested form items or other structures
}

export interface IStateFormItemCustom<T = any> {
  component?: string;
  props?: Record<string, any>;
  data?: T;
  validation?: Record<string, any>;
  icon?: string;
  faIcon?: string;
  iconProps?: Record<string, any>;
  svgIcon?: string;
  label?: string;
  items?: any[];
  formControlProps?: Record<string, any>;
  formLabelProps?: Record<string, any>;
  predefinedRegex?: string;
  color?: string;
  onclickHandle?: string;
}

export interface IStateFormItemGroup {
  id?: string;
  label?: string;
  items?: IStateFormItem[];
  layout?: 'row' | 'column';
  spacing?: number;
  type?: string;
  props?: Record<string, any>;
}

export interface IStateFormItemCheckboxBox {
  id?: string;
  name?: string;
  label?: string;
  checked?: boolean;
  value?: any;
  required?: boolean;
  disabled?: boolean;
  props?: Record<string, any>;
  color?: string;
  has?: Record<string, any>;
}

export interface IStateFormItemRadioButton {
  _id?: string;
  _key?: string;
  id?: string;
  name?: string;
  value?: any; // Make value optional for constructors
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  props?: Record<string, any>;
  color?: string;
  has?: {
    formControlLabelProps?: any;
    color?: string;
    [key: string]: any;
  };
}

export interface IStateFormItemSwitchToggle {
  id?: string;
  name?: string;
  label?: string;
  checked?: boolean;
  value?: any;
  disabled?: boolean;
  props?: Record<string, any>;
  formControlLabelProps?: any;
}

export type TStateFormItemType = 
  | 'text' 
  | 'email' 
  | 'password' 
  | 'number' 
  | 'textarea'
  | 'select'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'button'
  | 'hidden'
  | 'custom'
  | 'state_button'
  | 'stack';

export interface IStateFormItemSelectOption {
  value?: any; // Make value optional for constructors
  label?: string; // Make label optional for constructors
  title?: string;
  [key: string]: any;
}

export interface IStateForm {
  _id?: string;
  _key?: string;
  _type?: string;
  id?: string;
  title?: string;
  description?: string;
  action?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  items?: any[]; // Flexible array that can contain various item structures
  props?: Record<string, any>;
  validation?: Record<string, any>;
  submitButton?: IStateFormItem;
  cancelButton?: IStateFormItem;
  paperBackground?: boolean;
  paperProps?: Record<string, any>;
}

export interface IStateDialog<T = any> {
  _id?: string;
  _key?: string;
  _type?: string;
  id?: string;
  title?: string;
  content?: T;
  contentText?: string;
  open?: boolean;
  closable?: boolean;
  props?: Record<string, any>;
  titleProps?: Record<string, any>;
  contentProps?: Record<string, any>;
  contentTextProps?: Record<string, any>;
  actionsProps?: Record<string, any>;
  actions?: IStateFormItem[];
  onClose?: string; // function name as string for server
}

export interface IStateAppbar {
  _id?: string;
  _key?: string;
  appbarStyle?: string;
  title?: string;
  logo?: {
    src?: string;
    alt?: string;
    href?: string;
  };
  navigation?: IStateLink[];
  actions?: IStateFormItem[];
  props?: Record<string, any>;
  items?: any[];
  inputBaseProps?: Record<string, any>;
  inputBaseChips?: any[];
  searchFieldIcon?: Record<string, any>;
  searchFieldIconButton?: Record<string, any>;
  searchFieldIconButtonProps?: Record<string, any>;
  menuIconProps?: Record<string, any>;
  typography?: Record<string, any>;
  textLogoProps?: Record<string, any>;
  searchFieldProps?: Record<string, any>;
  hideSearchFieldIcon?: boolean;
  mobileMenuId?: string;
  menuItemsSx?: Record<string, any>;
  toolbarProps?: Record<string, any>;
}

export interface IStatePageDrawer {
  _id?: string;
  _key?: string;
  _type?: string;
  open?: boolean;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
  variant?: 'permanent' | 'persistent' | 'temporary';
  width?: number;
  content?: IStateComponent[];
  props?: Record<string, any>;
  items?: any[];
}

export interface IStatePage {
  _id?: string;
  _key?: string;
  _type?: string;
  id?: string;
  title?: string;
  description?: string;
  keywords?: string[];
  layout?: string;
  appbar?: IStateAppbar;
  drawer?: IStatePageDrawer;
  background?: IStateBackground;
  content?: IStateComponent[] | string; // Can be string in server context
  data?: Record<string, any>;
  props?: Record<string, any>;
  meta?: Record<string, any>;
  links?: Record<string, any>;
  typography?: any;
  forcedTitle?: string;
  appbarCustom?: IStateComponent | boolean; // Can be a component or boolean
  hideAppbar?: boolean;
  hideDrawer?: boolean;
  useDefaultAppbar?: boolean;
  useDefaultDrawer?: boolean;
  generateDefaultDrawer?: boolean;
  useDefaultBackground?: boolean;
  useDefaultTypography?: boolean;
  inherited?: string;
  appbarInherited?: string;
  appbarCustomInherited?: string;
  drawerInherited?: string;
  contentInherited?: string;
  backgroundInherited?: string;
}

export interface IStateApp {
  title?: string;
  version?: string;
  theme?: string;
  locale?: string;
  timezone?: string;
  logoUri?: string;
  homepage?: string;
  fetchingStateAllowed?: boolean;
  inDebugMode?: boolean;
  inDevelMode?: boolean;
  themeMode?: string;
  isBootstrapped?: boolean;
}

export interface IStateIcon {
  name?: string;
  variant?: string;
  size?: string | number;
  color?: string;
  props?: Record<string, any>;
  paths?: any[];
  fill?: string;
  viewBox?: string;
  height?: number;
  width?: number;
  enableBackground?: string;
  rects?: any[];
  groups?: any[];
}

// Collection types
export interface IStateAllPages {
  [key: string]: IStatePage;
}

export interface IStateAllForms {
  [key: string]: IStateForm;
}

export interface IStateAllDialogs {
  [key: string]: IStateDialog;
}

export interface IStateAllIcons {
  [key: string]: IStateIcon;
}

// Group types - expanded to match actual usage
export type TItemGroup = 'header' | 'body' | 'footer' | 'sidebar' | 'navigation' | 'stack';

// Additional missing types
export type TTItemGroup = TItemGroup;
