export type DesignToken = TokenBase & Record<string, UntypedValueGroup | Value>

interface TokenBase {
  $description?: string
  $extensions?: Record<string, unknown>
}

interface UntypedValueGroup {
  [key: string]: (UntypedValueGroup | TypedValue) & TokenBase
}

type TypedValueGroupRoot<T extends ValueType> = {
  $type: T
  $value?: never
} & TypedValueGroup<T>

interface TypedValueGroup<T extends ValueType> {
  [key: string]: (ValueOf<T> | TypedValueGroup<T>) & TokenBase
}

type TypedValue<T extends ValueType = ValueType> = ValueOf<T> | TypedValueGroupRoot<T>

export type Value =
  | ColorValue
  | DimensionValue
  | FontFamilyValue
  | FontWeightValue
  | DurationValue
  | CubicBezierValue
  | NumberValue
  | StrokeValue
  | BorderValue
  | TransitionValue
  | ShadowValue
  | GradientValue
  | TypographyValue

export type ValueType = Value['$type']

type ValueOf<T extends ValueType> = Extract<Value, { $type: T }>

export type Path = `{${string}}`

export function validatePath(value: unknown): value is Path {
  return typeof value === 'string' && /^\{[a-zA-Z0-9_]+\}$/.test(value)
}

/**
 * @example `#ff0000` or `#ff0000ff`
 */
export type Color = `#${string}`

export function validateColor(value: unknown): value is Color {
  return typeof value === 'string' && (/^#[0-9a-fA-F]{6}$/.test(value) || /^#[0-9a-fA-F]{8}$/.test(value))
}

export interface ColorValue {
  $value: Color | Path
  $type: 'color'
}

/**
 * @example `1rem` or `16px`
 */
export type Dimension = string

export function validateDimension(value: unknown): value is Dimension {
  return typeof value === 'string' && /^(\d+(\.\d+)?(px|rem))$/.test(value)
}

export interface DimensionValue {
  $value: Dimension | Path
  $type: 'dimension'
}

/**
 * @example `'Helvetica Neue'` or `['Helvetica Neue', 'Arial', 'sans-serif']`
 */
export type FontFamily = string | string[]

export function validateFontFamily(value: unknown): value is FontFamily {
  if (typeof value === 'string') {
    return true
  }

  if (Array.isArray(value)) {
    return value.every((v) => typeof v === 'string')
  }

  return false
}

export interface FontFamilyValue {
  $value: FontFamily | Path
  $type: 'fontFamily'
}

type FontWeightAlias =
  | 'thin'
  | 'hairline'
  | 'extra-light'
  | 'ultra-light'
  | 'light'
  | 'normal'
  | 'regular'
  | 'book'
  | 'medium'
  | 'semi-bold'
  | 'demi-bold'
  | 'bold'
  | 'extra-bold'
  | 'ultra-bold'
  | 'black'
  | 'heavy'
  | 'extra-black'
  | 'ultra-black'

export function validateFontWeight(value: unknown): value is FontWeight {
  if (typeof value === 'number') {
    return value > 0 && value < 1000
  }

  if (typeof value === 'string') {
    return [
      'thin',
      'hairline',
      'extra-light',
      'ultra-light',
      'light',
      'normal',
      'regular',
      'book',
      'medium',
      'semi-bold',
      'demi-bold',
      'bold',
      'extra-bold',
      'ultra-bold',
      'black',
      'heavy',
      'extra-black',
      'ultra-black',
    ].includes(value)
  }

  return false
}

/**
 * @example `100` or `'bold'`
 */
export type FontWeight = FontWeightAlias | number

export interface FontWeightValue {
  $value: FontWeight | Path
  $type: 'fontWeight'
}

/**
 * @example `100ms`
 */
export type Duration = `${number}ms`

export function validateDuration(value: unknown): value is Duration {
  return typeof value === 'string' && /^\d+ms$/.test(value)
}

export interface DurationValue {
  $value: Duration | Path
  $type: 'duration'
}

/**
 * @example [0.42, 0, 0.58, 1]
 */
export type CubicBezier = [number, number, number, number]

export function validateCubicBezier(value: unknown): value is CubicBezier {
  return Array.isArray(value) && value.length === 4 && value.every((v) => typeof v === 'number')
}

export interface CubicBezierValue {
  $value: CubicBezier
  $type: 'cubicBezier'
}

export interface NumberValue {
  $value: number | Path
  $type: 'number'
}

export type StrokeStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'groove' | 'ridge' | 'inset' | 'outset'

export type LineCap = 'butt' | 'round' | 'square'

export interface StrokeObject {
  dashArray: [Dimension | Path, Dimension | Path]
  lineCap: LineCap
}

export type Stroke = StrokeStyle | StrokeObject

export function validateStroke(value: unknown): value is Stroke {
  if (typeof value === 'string') {
    return ['solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset'].includes(value)
  }

  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return validateStrokeStyle((value as StrokeObject).dashArray) && validateLineCap((value as StrokeObject).lineCap)
  }

  return false
}

function validateStrokeStyle(value: unknown): value is [Dimension | Path, Dimension | Path] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    (validateDimension(value[0]) || validatePath(value[0])) &&
    (validateDimension(value[1]) || validatePath(value[1]))
  )
}

function validateLineCap(value: unknown): value is LineCap {
  return ['butt', 'round', 'square'].includes(value as string)
}

export interface StrokeValue {
  $value: Stroke | Path
  $type: 'stroke'
}

export interface Border {
  color: Color | Path
  width: Dimension | Path
  style: Stroke | Path
}

export function validateBorder(value: unknown): value is Border {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    validateColor((value as Border).color) &&
    validateDimension((value as Border).width) &&
    validateStroke((value as Border).style)
  )
}

export interface BorderValue {
  $value: Border | Path
  $type: 'border'
}

export interface Transition {
  duration: Duration | Path
  delay: Duration | Path
  timingFunction: CubicBezier | Path
}

export function validateTransition(value: unknown): value is Transition {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    validateDuration((value as Transition).duration) &&
    validateDuration((value as Transition).delay) &&
    validateCubicBezier((value as Transition).timingFunction)
  )
}

export interface TransitionValue {
  $value: Transition | Path
  $type: 'transition'
}

export interface Shadow {
  offsetX: Dimension | Path
  offsetY: Dimension | Path
  blur: Dimension | Path
  spread: Dimension | Path
  color: Color | Path
}

export function validateShadow(value: unknown): value is Shadow {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    validateDimension((value as Shadow).offsetX) &&
    validateDimension((value as Shadow).offsetY) &&
    validateDimension((value as Shadow).blur) &&
    validateDimension((value as Shadow).spread) &&
    validateColor((value as Shadow).color)
  )
}

export interface ShadowValue {
  $value: Shadow | Path
  $type: 'shadow'
}

export interface Gradient {
  color: Color | Path
  position: number | Path
}

export function validateGradient(value: unknown): value is Gradient {
  return (
    (typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      (validateColor((value as Gradient).color) || validatePath((value as Gradient).color)) &&
      typeof (value as Gradient).position === 'number' &&
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      (value as any).position >= 0 &&
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      (value as any).position <= 1) ||
    validatePath((value as Gradient).position)
  )
}

export interface GradientValue {
  $value: (Gradient | Path)[]
  $type: 'gradient'
}

export interface Typography {
  fontFamily: FontFamily | Path
  fontWeight: FontWeight | Path
  fontSize: Dimension | Path
  lineHeight: number | Path
  letterSpacing: Dimension | Path
}

export function validateTypography(value: unknown): value is Typography {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    validateFontFamily((value as Typography).fontFamily) &&
    validateFontWeight((value as Typography).fontWeight) &&
    validateDimension((value as Typography).fontSize) &&
    (typeof (value as Typography).lineHeight === 'number' || validatePath((value as Typography).lineHeight)) &&
    validateDimension((value as Typography).letterSpacing)
  )
}

export interface TypographyValue {
  $value: Typography | Path
  $type: 'typography'
}
