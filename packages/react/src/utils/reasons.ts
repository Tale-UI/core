import * as REASONS from './reason-parts';

export { REASONS };
export type TaleUIEventReasons = typeof REASONS;
export type TaleUIEventReason = TaleUIEventReasons[keyof TaleUIEventReasons];
