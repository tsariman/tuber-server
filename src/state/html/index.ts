
export type THMarkup = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/** Wraps title in an `h1` to `h6` tag. Defaults to `h1` */
export const title_centered = (title: string, markupTag: THMarkup = 'h1') => {
  return `<${markupTag} style="text-align: center;">${title}</${markupTag}>`
}

/** Wraps text in an HTML `p` tag. */
export const paragraph = (text: string) => `<p>${text}</p>`;