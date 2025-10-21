
export default class TypographyStateBuilder {
  private _typographyState: Record<string, unknown>;

  constructor() {
    this._typographyState = {};
  }

  setVariant(variant: string) {
    this._typographyState.variant = variant;
    return this;
  }

  setAlign(align: string) {
    this._typographyState.align = align;
    return this;
  }

  setFontFamily(fontFamily: string) {
    this._typographyState.fontFamily = fontFamily;
    return this;
  }

  setFontWeight(fontWeight: string) {
    this._typographyState.fontWeight = fontWeight;
    return this;
  }

  setFontSize(fontSize: string) {
    this._typographyState.fontSize = fontSize;
    return this;
  }

  setLineHeight(lineHeight: string) {
    this._typographyState.lineHeight = lineHeight;
    return this;
  }

  setLetterSpacing(letterSpacing: string) {
    this._typographyState.letterSpacing = letterSpacing;
    return this;
  }

  setColor(color: string) {
    this._typographyState.color = color;
    return this;
  }

  build() {
    return this._typographyState;
  }
}