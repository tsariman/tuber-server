// Shared types between client and server that don't depend on browser/React APIs

export interface IJsonapiDataAttributes {
  [key: string]: any;
}

export interface IJsonapiError {
  id?: string;
  links?: IJsonapiErrorLinks;
  status?: string;
  code?: string;
  title?: string;
  detail?: string;
  source?: IJsonapiErrorSource;
  meta?: Record<string, any>;
}

export interface IJsonapiErrorLinks {
  about?: IJsonapiLink;
  type?: IJsonapiLink;
}

export interface IJsonapiErrorResponse {
  errors: IJsonapiError[];
  meta?: Record<string, any>;
  links?: Record<string, IJsonapiLink | string>; // Support both string and IJsonapiLink
}

export interface IJsonapiErrorSource {
  pointer?: string;
  parameter?: string;
  header?: string;
}

export interface IJsonapiRequest<T = IJsonapiDataAttributes> {
  data: IJsonapiResource<T>;
  included?: IJsonapiResource[];
  meta?: Record<string, any>;
}

export interface IJsonapiLink {
  href: string;
  meta?: Record<string, any>;
}

export interface IJsonapiPaginationLinks {
  first?: IJsonapiLink | string;
  last?: IJsonapiLink | string;
  prev?: IJsonapiLink | string;
  next?: IJsonapiLink | string;
  self?: string;
  [key: string]: IJsonapiLink | string | undefined;
}

export interface IJsonapiResource<T = IJsonapiDataAttributes> {
  type: string;
  id?: string;
  attributes?: T;
  relationships?: Record<string, {
    data?: IJsonapiResourceLinkage | IJsonapiResourceLinkage[];
    links?: Record<string, IJsonapiLink | string>; // Support string links
    meta?: Record<string, any>;
  }>;
  links?: Record<string, IJsonapiLink | string>; // Support string links
  meta?: Record<string, any>;
}

export interface IJsonapiResourceLinkage {
  type: string;
  id: string;
  meta?: Record<string, any>;
}

export interface IJsonapiResponse {
  data?: IJsonapiResource | IJsonapiResource[] | null;
  errors?: IJsonapiError[];
  meta?: Record<string, any>;
  links?: IJsonapiPaginationLinks | Record<string, IJsonapiLink | string>;
  included?: IJsonapiResource[];
  jsonapi?: {
    version: string;
  };
  state?: any; // For server-specific state data
}

// Basic form choices interface
export interface IFormChoices {
  [key: string]: any;
}

// Basic network state interface (server-compatible)
export interface INetState {
  csrfTokenName?: string;
  csrfTokenMethod?: string;
  csrfToken?: string;
  headers?: Record<string, string>;
  // Allow additional properties for server state
  [key: string]: any;
}

// Theme options interface (simplified for server)
export interface IThemeOptions {
  palette?: {
    mode?: 'light' | 'dark';
    primary?: {
      main?: string;
    };
    secondary?: {
      main?: string;
    };
    background?: {
      default?: string;
    };
    grey?: {
      [key: string]: string;
    };
  };
  components?: Record<string, any>; // For MUI theme components
  typography?: Record<string, any>; // For MUI theme typography
}

// Bootstrap response interface
export interface IBootstrapResponse {
  state: INetState;
  meta?: Record<string, any>; // Make meta optional since it's often not provided
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

// State map interfaces
export interface IStateMapEntry<T = any> {
  state: T;
  clearance?: string;
}

export interface IStateMap {
  [entry: string]: IStateMapEntry;
}

// Theme mode
export type TThemeMode = 'light' | 'dark';

// Endpoint types
export type TEndpoint = 'users' | 'entries' | 'bookmarks' | 'tags' | 'authorizations';

// Generic JSON API query string
export interface IJsonapiQuerystring {
  'page[number]'?: string;
  'page[size]'?: string;
  'query'?: string;
  'filter[is_published]'?: string;
  'filter[is_active]'?: string;
  'filter[search]'?: string;
}

// Utility types
export type TObj<T = unknown> = Record<string, T>;

export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type TOptional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;

// Mongoose document interfaces
export interface IMPV2Doc<T = any> { 
  _doc: T; 
}

export interface IAggregateDoc {
  _id: string;
  __v: number;
}
