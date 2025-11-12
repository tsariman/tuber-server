import {
  TStateForm,
  TJsonapiErrorResponse,
  TStateFormItem
} from '@tuber/shared'
import JsonapiErrorBuilder from './builder/JsonapiErrorBuilder'
import { is_record } from '../utility'

/**
 * A utility class for validating plain object data.
 * Provides methods to check required fields and validate against form state rules.
 */
export default class RequestDataValidator<T = Record<string, unknown>> {
  private _record: T
  private _formState?: TStateForm

  constructor(record: T, formState?: TStateForm) {
    this._record = (record ?? {}) as T
    this._formState = formState
  }

  /**
   * Get the form state used for validation
   * @returns The form state object or undefined if not set
   */
  getFormState = (): TStateForm | undefined => this._formState

  /**
   * Get a specific attribute value by key
   * @param key The attribute key to retrieve
   * @returns The attribute value or undefined if not found
   */
  getAttribute<K extends keyof T>(key: K): T[K] | undefined {
    return this._record?.[key]
  }

  /**
   * Get a specific attribute value with a default fallback
   * @param key The attribute key to retrieve
   * @param defaultValue The default value to return if attribute is not found
   * @returns The attribute value or the default value
   */
  getAttributeOrDefault<K extends keyof T>(key: K, defaultValue: T[K]): T[K] {
    const value = this.getAttribute(key)
    return value !== undefined ? value : defaultValue
  }

  /**
   * Check if a specific attribute exists and has a truthy value
   * @param key The attribute key to check
   * @returns true if attribute exists and is truthy, false otherwise
   */
  hasAttribute<K extends keyof T>(key: K): boolean {
    const value = this.getAttribute(key)
    return !!value
  }

  /**
   * Validate that the request has required fields
   * @param requiredAttributes Array of required attribute keys
   * @param useFormValidation Whether to also validate against form state rules
   * @returns Object with isValid boolean and missing fields array
   */
  validate(requiredAttributes: (keyof T)[] = [], useFormValidation = false): {
    isValid: boolean
    missing: string[]
    errors?: TJsonapiErrorResponse
  } {
    const missing: string[] = []

    for (const key of requiredAttributes) {
      if (this._record[key] === undefined || this._record[key] === null) {
        missing.push(String(key))
      }
    }

    // Check form state validation if requested
    let formErrors: TJsonapiErrorResponse | null = null
    if (useFormValidation) {
      formErrors = this.validateAgainstFormState()
    }

    const isValid = missing.length === 0 && !formErrors

    return {
      isValid,
      missing,
      ...(formErrors && { errors: formErrors })
    }
  }

  /**
   * Validate record attributes against form state validation rules
   * @returns Validation error response with validation errors, or null if valid
   */
  validateAgainstFormState(): TJsonapiErrorResponse | null {
    if (!this._formState?.items) {
      return null
    }
    const attributes = this._record
    if (!is_record(attributes)) {
      return null
    }
    const errorBuilder = new JsonapiErrorBuilder()
    let hasErrors = false
    let errorIndex = 0

    // Helper function to recursively validate form items
    const validateFormItems = (items: TStateFormItem[], pathPrefix = '') => {
      for (const item of items) {
        if (item.name && item.has) {
          const fieldName = item.name
          const fieldPath = pathPrefix ? `${pathPrefix}.${fieldName}` : fieldName
          const fieldValue = attributes[fieldName]
          const validationRules = item.has

          // Check required validation
          if (validationRules.required && (fieldValue === undefined || fieldValue === null || fieldValue === '')) {
            if (errorIndex > 0) {
              errorBuilder.next()
            }
            errorBuilder
              .withStatus(400)
              .withCode('VALIDATION_ERROR')
              .withTitle(validationRules.requiredMessage || `${fieldName} is required`)
              .withSource({ pointer: `/${fieldPath}` })
            hasErrors = true
            errorIndex++
            continue
          }

          // Skip other validations if field is empty and not required
          if (fieldValue === undefined || fieldValue === null || fieldValue === '') {
            continue
          }

          // Check maxLength validation
          if (validationRules.maxLength && typeof fieldValue === 'string' && fieldValue.length > validationRules.maxLength) {
            if (errorIndex > 0) {
              errorBuilder.next()
            }
            errorBuilder
              .withStatus(400)
              .withCode('VALIDATION_ERROR')
              .withTitle(validationRules.maxLengthMessage || `${fieldName} exceeds maximum length of ${validationRules.maxLength}`)
              .withSource({ pointer: `/${fieldPath}` })
            hasErrors = true
            errorIndex++
            continue
          }

          // Check validationRegex
          if (validationRules.validationRegex && typeof fieldValue === 'string') {
            const regex = new RegExp(validationRules.validationRegex)
            if (!regex.test(fieldValue)) {
              if (errorIndex > 0) {
                errorBuilder.next()
              }
              errorBuilder
                .withStatus(400)
                .withCode('VALIDATION_ERROR')
                .withTitle(validationRules.validationMessage || `${fieldName} format is invalid`)
                .withSource({ pointer: `/${fieldPath}` })
              hasErrors = true
              errorIndex++
              continue
            }
          }

          // Check invalidationRegex
          if (validationRules.invalidationRegex && typeof fieldValue === 'string') {
            const regex = new RegExp(validationRules.invalidationRegex)
            if (regex.test(fieldValue)) {
              if (errorIndex > 0) {
                errorBuilder.next()
              }
              errorBuilder
                .withStatus(400)
                .withCode('VALIDATION_ERROR')
              .withTitle(validationRules.invalidationMessage || `${fieldName} contains invalid characters`)
              .withSource({ pointer: `/${fieldPath}` })
              hasErrors = true
              errorIndex++
              continue
            }
          }

          // Check mustMatch validation (compare with another field)
          if (validationRules.mustMatch && typeof fieldValue === 'string') {
            const matchValue = attributes[validationRules.mustMatch]
            if (matchValue !== undefined && fieldValue !== matchValue) {
              if (errorIndex > 0) {
                errorBuilder.next()
              }
              errorBuilder
                .withStatus(400)
                .withCode('VALIDATION_ERROR')
                .withTitle(validationRules.mustMatchMessage || `${fieldName} must match ${validationRules.mustMatch}`)
                .withSource({ pointer: `/${fieldPath}` })
              hasErrors = true
              errorIndex++
              continue
            }
          }
        }

        // Recursively validate nested items (for complex form structures)
        if (item.items) {
          validateFormItems(item.items, item.name ? `${pathPrefix ? pathPrefix + '.' : ''}${item.name}` : pathPrefix)
        }
      }
    }

    validateFormItems(this._formState.items)

    return hasErrors ? errorBuilder.build() : null
  }
}