import type { SxProps, Theme } from '@mui/material'

export const ADMIN_PANEL_FORM_SX: SxProps<Theme> = {
  'p': 3,
  'width': '37ch',
  'border': '1px solid',
  'borderColor': 'divider',
  'borderRadius': 2,
  '& .MuiFormControl-root': {
    'width': '100%'
  },
  '& .MuiInputLabel-root': {
    'fontSize': '0.72rem',
    'fontWeight': 700,
    'letterSpacing': '0.06em',
    'textTransform': 'uppercase',
    'color': 'text.secondary'
  },
  '& .MuiInputLabel-standard': {
    'fontSize': '0.82rem',
    '&.MuiInputLabel-shrink': {
      'fontSize': '0.82rem',
      'transform': 'translate(0, -1.5px) scale(0.9)'
    }
  },
  '& .MuiInputLabel-outlined': {
    'fontSize': '0.82rem',
    '&.MuiInputLabel-shrink': {
      'fontSize': '0.82rem',
      'backgroundColor': 'action.hover',
      'padding': '0 4px',
      'borderRadius': '4px',
      'transform': 'translate(14px, -8px) scale(0.9)'
    }
  },
  '& .MuiInputBase-root': {
    'borderRadius': 1,
    'backgroundColor': 'action.hover',
    'transition': 'border-color 120ms ease-in-out, box-shadow 120ms ease-in-out'
  },
  '& .MuiInputBase-input': {
    'fontSize': '0.92rem'
  }
}

export const ADMIN_PANEL_FIELD_SX: SxProps<Theme> = {
  '& .MuiInputBase-root': {
    'alignItems': 'center'
  },
  '& .MuiInputBase-input': {
    'px': 1.5,
    'py': '12px',
    'lineHeight': 1.4,
    '&::placeholder': {
      'lineHeight': 1.4,
      'opacity': 0.9
    }
  }
}

export const ADMIN_PANEL_LINK_ROW_SX: SxProps<Theme> = {
  'mt': '0 !important',
  'textAlign': 'right'
}

export const ADMIN_PANEL_LINK_SX: SxProps<Theme> = {
  'mt': '0 !important',
  'fontSize': '0.875rem',
  'textDecoration': 'none',
  '&:hover': {
    'textDecoration': 'underline'
  }
}

export const ADMIN_PANEL_PRIMARY_ACTION_SX: SxProps<Theme> = {
  'mt': 1,
  'width': '100%',
  'fontWeight': 600,
  'textTransform': 'none'
}