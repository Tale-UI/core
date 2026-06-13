/**
 * Maps React Aria state properties to Tale UI `data-*` attributes.
 *
 * React Aria hooks return state objects with `is*` boolean properties
 * (e.g., `isDisabled`, `isSelected`). Tale UI CSS uses `data-*` attributes
 * (e.g., `data-disabled`, `data-checked`). This module bridges the two.
 */

export interface AriaStateMap {
  isDisabled?: boolean;
  isSelected?: boolean;
  isPressed?: boolean;
  isFocused?: boolean;
  isFocusVisible?: boolean;
  isHovered?: boolean;
  isIndeterminate?: boolean;
  isReadOnly?: boolean;
  isRequired?: boolean;
  isInvalid?: boolean;
  isOpen?: boolean;
}

/**
 * Converts React Aria `is*` state booleans into Tale UI `data-*` attribute props.
 *
 * Usage:
 * ```tsx
 * const dataAttrs = mapAriaState({ isDisabled: true, isPressed: false });
 * // => { 'data-disabled': '' }
 * ```
 */
export function mapAriaState(state: AriaStateMap): Record<string, string> {
  const attrs: Record<string, string> = {};

  if (state.isDisabled) {attrs['data-disabled'] = '';}
  if (state.isPressed) {attrs['data-pressed'] = '';}
  if (state.isFocused) {attrs['data-highlighted'] = '';}
  if (state.isFocusVisible) {attrs['data-focus-visible'] = '';}
  if (state.isHovered) {attrs['data-hovered'] = '';}
  if (state.isReadOnly) {attrs['data-readonly'] = '';}
  if (state.isRequired) {attrs['data-required'] = '';}
  if (state.isInvalid) {attrs['data-invalid'] = '';}

  // React Aria uses `isSelected` for both toggle (checkbox/switch) and list items.
  // Tale UI distinguishes: `data-checked` for toggles, `data-selected` for list items.
  // Components choose the right mapping by calling mapToggleState or mapSelectionState.

  if (state.isOpen) {
    attrs['data-open'] = '';
  } else if (state.isOpen === false) {
    attrs['data-closed'] = '';
  }

  return attrs;
}

/**
 * Maps toggle-like state (Checkbox, Switch, Toggle) where `isSelected` → `data-checked`.
 */
export function mapToggleState(state: AriaStateMap): Record<string, string> {
  const attrs = mapAriaState(state);

  if (state.isSelected) {
    attrs['data-checked'] = '';
  } else if (state.isSelected === false) {
    attrs['data-unchecked'] = '';
  }

  if (state.isIndeterminate) {
    attrs['data-indeterminate'] = '';
    delete attrs['data-checked'];
    delete attrs['data-unchecked'];
  }

  return attrs;
}

/**
 * Maps selection state (Select item, Menu item, ListBox item) where `isSelected` → `data-selected`.
 */
export function mapSelectionState(state: AriaStateMap): Record<string, string> {
  const attrs = mapAriaState(state);

  if (state.isSelected) {
    attrs['data-selected'] = '';
  }

  return attrs;
}

/**
 * Parses a React Aria `placement` string (e.g., "bottom start") into
 * Tale UI `data-side` and `data-align` attributes.
 */
export function mapPlacement(placement: string | undefined): Record<string, string> {
  if (!placement) {return {};}

  const parts = placement.split(' ');
  const attrs: Record<string, string> = {};

  if (parts[0]) {
    attrs['data-side'] = parts[0]; // top, bottom, left, right
  }
  if (parts[1]) {
    attrs['data-align'] = parts[1]; // start, end
  } else {
    attrs['data-align'] = 'center';
  }

  return attrs;
}
