import { PaperProps, SxProps } from '@mui/material';
import IStateAvatar from './IStateAvatar';
import IStateForm from './IStateForm';
import IStateFormItem from './IStateFormItem';

export interface IDialogProps {
  open?: boolean;
  onClose?: Function;
  'aria-describedby'?: string;
  'aria-labelledby'?: string;
  /** @deprecated */
  backdropComponent?: unknown;
  children?: unknown;
  classes?: unknown;
  disableEscapeKeyDown?: boolean;
  fullScreen?: boolean;
  fullWidth?: boolean;
  maxWidth?: 'xs'|'sm'|'md'|'lg'|'xl'| false;
  onBackdropClick?: () => void;
  PaperComponent?: unknown;
  PaperProps?: PaperProps;
  scroll?: 'body' | 'paper';
  sx?: SxProps;
  TransitionComponent?: unknown;
  transitionDuration?: unknown;
  TransitionProps?: unknown;
  [prop: string]: unknown;
}

export interface IDialogActionsProps {
  children?: unknown;
  classes?: unknown;
  disableSpacing?: boolean;
  sx?: SxProps;
  [prop: string]: unknown;
}

export interface IDialogContentProps {
  children?: unknown;
  classes?: unknown;
  dividers?: boolean;
  sx?: SxProps;
  [prop: string]: unknown;
}

export interface IDialogContentTextProps {
  children?: unknown;
  classes?: unknown;
  sx?: SxProps;
  [prop: string]: unknown;
}

export interface IDialogTitleProps {
  children?: unknown;
  classes?: unknown;
  sx?: SxProps;
  [prop: string]: unknown;
}

export interface ISlideProps {
  children?: unknown;
  addEndListener?: Function;
  appear?: boolean;
  container?: unknown;
  direction?: 'down'|'left'|'right'|'up';
  easing?: unknown;
  in?: boolean;
  timeout?: unknown;
  [prop: string]: unknown;
}

export interface IStateDialogSelectionItem<T=unknown> {
  title?: string;
  avatar?: IStateAvatar;
  info?: T;
}

/**
 * Dialog base state
 */
export default interface IStateDialog<T=unknown> extends IStateForm {
  /** Set the dialog type */
  _type?: 'selection' | 'alert' | 'form' | 'any';
  open?: boolean;
  title?: string;
  label?: string;
  contentText?: string;
  content?: unknown;
  /** Button component */
  actions?: IStateFormItem[]; // for defining the dialog actions
  /** [TODO] Check if this property is in use. If not, remove it. */
  showActions?: boolean;
  onSubmit?: () => void;
  /** Required for dialogs that display a list of items */
  list?: IStateDialogSelectionItem<T>[];
  /** 
   * When a dialog displays a list of items, this callback should run when 
   * clicking on an item.
   */
  callback?: (item: IStateDialogSelectionItem<T>) => void;

  /** @see https://mui.com/material-ui/api/dialog/ */
  props?: IDialogProps;
  /** @see https://mui.com/material-ui/api/dialog-title/ */
  titleProps?: IDialogTitleProps;
  /** @see https://mui.com/material-ui/api/dialog-content/ */
  contentProps?: IDialogContentProps;
  /** @see https://mui.com/material-ui/api/dialog-content-text/ */
  contentTextProps?: IDialogContentTextProps;
  /** @see https://mui.com/material-ui/api/dialog-actions/ */
  actionsProps?: IDialogActionsProps;
  /** @see https://mui.com/material-ui/api/slide/ */
  slideProps?: ISlideProps;
}
