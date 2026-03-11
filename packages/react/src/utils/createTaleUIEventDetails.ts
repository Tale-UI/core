import { EMPTY_OBJECT } from './constants';
import { REASONS } from './reasons';

interface ReasonToEventMap {
  [REASONS.none]: Event;

  [REASONS.triggerPress]: MouseEvent | PointerEvent | TouchEvent | KeyboardEvent;
  [REASONS.triggerHover]: MouseEvent;
  [REASONS.triggerFocus]: FocusEvent;

  [REASONS.outsidePress]: MouseEvent | PointerEvent | TouchEvent;
  [REASONS.itemPress]: MouseEvent | KeyboardEvent | PointerEvent;
  [REASONS.closePress]: MouseEvent | KeyboardEvent | PointerEvent;
  [REASONS.linkPress]: MouseEvent | PointerEvent;
  [REASONS.clearPress]: PointerEvent | MouseEvent | KeyboardEvent;
  [REASONS.chipRemovePress]: PointerEvent | MouseEvent | KeyboardEvent;
  [REASONS.trackPress]: PointerEvent | MouseEvent | TouchEvent;
  [REASONS.incrementPress]: PointerEvent | MouseEvent | TouchEvent;
  [REASONS.decrementPress]: PointerEvent | MouseEvent | TouchEvent;

  [REASONS.inputChange]: InputEvent | Event;
  [REASONS.inputClear]: InputEvent | FocusEvent | Event;
  [REASONS.inputBlur]: FocusEvent;
  [REASONS.inputPaste]: ClipboardEvent;
  [REASONS.inputPress]: MouseEvent | PointerEvent | TouchEvent | KeyboardEvent;

  [REASONS.focusOut]: FocusEvent | KeyboardEvent;
  [REASONS.escapeKey]: KeyboardEvent;
  [REASONS.closeWatcher]: Event;
  [REASONS.listNavigation]: KeyboardEvent;
  [REASONS.keyboard]: KeyboardEvent;

  [REASONS.pointer]: PointerEvent;
  [REASONS.drag]: PointerEvent | TouchEvent;
  [REASONS.swipe]: PointerEvent | TouchEvent;
  [REASONS.wheel]: WheelEvent;
  [REASONS.scrub]: PointerEvent;

  [REASONS.cancelOpen]: MouseEvent;
  [REASONS.siblingOpen]: Event;
  [REASONS.disabled]: Event;
  [REASONS.imperativeAction]: Event;

  [REASONS.windowResize]: UIEvent;
}

/**
 * Maps a change `reason` string to the corresponding native event type.
 */
export type ReasonToEvent<Reason extends string> = Reason extends keyof ReasonToEventMap
  ? ReasonToEventMap[Reason]
  : Event;

type TaleUIChangeEventDetail<Reason extends string, CustomProperties extends object> = {
  /**
   * The reason for the event.
   */
  reason: Reason;
  /**
   * The native event associated with the custom event.
   */
  event: ReasonToEvent<Reason>;
  /**
   * Cancels Tale UI from handling the event.
   */
  cancel: () => void;
  /**
   * Allows the event to propagate in cases where Tale UI will stop the propagation.
   */
  allowPropagation: () => void;
  /**
   * Indicates whether the event has been canceled.
   */
  isCanceled: boolean;
  /**
   * Indicates whether the event is allowed to propagate.
   */
  isPropagationAllowed: boolean;
  /**
   * The element that triggered the event, if applicable.
   */
  trigger: Element | undefined;
} & CustomProperties;

/**
 * Details of custom change events emitted by Tale UI components.
 */
export type TaleUIChangeEventDetails<
  Reason extends string,
  CustomProperties extends object = {},
> = Reason extends string ? TaleUIChangeEventDetail<Reason, CustomProperties> : never;

/**
 * Details of custom generic events emitted by Tale UI components.
 */
type TaleUIGenericEventDetail<Reason extends string, CustomProperties extends object> = {
  /**
   * The reason for the event.
   */
  reason: Reason;
  /**
   * The native event associated with the custom event.
   */
  event: ReasonToEvent<Reason>;
} & CustomProperties;

export type TaleUIGenericEventDetails<
  Reason extends string,
  CustomProperties extends object = {},
> = Reason extends string ? TaleUIGenericEventDetail<Reason, CustomProperties> : never;

/**
 * Creates a Tale UI event details object with the given reason and utilities
 * for preventing Tale UI's internal event handling.
 */
export function createChangeEventDetails<
  Reason extends string,
  CustomProperties extends object = {},
>(
  reason: Reason,
  event?: ReasonToEvent<Reason>,
  trigger?: HTMLElement,
  customProperties?: CustomProperties,
): TaleUIChangeEventDetails<Reason, CustomProperties> {
  let canceled = false;
  let allowPropagation = false;
  const custom = customProperties ?? (EMPTY_OBJECT as CustomProperties);
  const details: TaleUIChangeEventDetail<Reason, CustomProperties> = {
    reason,
    event: (event ?? new Event('tale-ui')) as ReasonToEvent<Reason>,
    cancel() {
      canceled = true;
    },
    allowPropagation() {
      allowPropagation = true;
    },
    get isCanceled() {
      return canceled;
    },
    get isPropagationAllowed() {
      return allowPropagation;
    },
    trigger,
    ...custom,
  };
  return details as TaleUIChangeEventDetails<Reason, CustomProperties>;
}

export function createGenericEventDetails<
  Reason extends string,
  CustomProperties extends object = {},
>(
  reason: Reason,
  event?: ReasonToEvent<Reason>,
  customProperties?: CustomProperties,
): TaleUIGenericEventDetails<Reason, CustomProperties> {
  const custom = customProperties ?? (EMPTY_OBJECT as CustomProperties);
  const details: TaleUIGenericEventDetail<Reason, CustomProperties> = {
    reason,
    event: (event ?? new Event('tale-ui')) as ReasonToEvent<Reason>,
    ...custom,
  };
  return details as TaleUIGenericEventDetails<Reason, CustomProperties>;
}
