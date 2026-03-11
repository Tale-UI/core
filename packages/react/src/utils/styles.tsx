const DISABLE_SCROLLBAR_CLASS_NAME = 'tale-ui-disable-scrollbar';

export const styleDisableScrollbar = {
  className: DISABLE_SCROLLBAR_CLASS_NAME,
  getElement(nonce?: string) {
    return (
      <style nonce={nonce} href={DISABLE_SCROLLBAR_CLASS_NAME} precedence="tale-ui:low">
        {`.${DISABLE_SCROLLBAR_CLASS_NAME}{scrollbar-width:none}.${DISABLE_SCROLLBAR_CLASS_NAME}::-webkit-scrollbar{display:none}`}
      </style>
    );
  },
};
