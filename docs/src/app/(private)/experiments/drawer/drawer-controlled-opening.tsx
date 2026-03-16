'use client';
import * as React from 'react';
import { Drawer } from '@tale-ui/react/drawer';

export default function ControlledOpening() {
  const [open, setOpen] = React.useState(false);
  const [locked, setLocked] = React.useState(false);
  return (
    <Drawer.Root
      open={open}
      onOpenChange={(nextOpen: boolean) => {
        if (locked) {
          return;
        }
        setOpen(nextOpen);
      }}
    >
      <div className="flex items-center gap-4">
        <Drawer.Trigger className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100">
          Open bottom drawer
        </Drawer.Trigger>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={locked}
            onChange={(event) => setLocked(event.target.checked)}
          />
          Lock open state
        </label>
      </div>
      <Drawer.Backdrop className="fixed inset-0 bg-black/20 dark:bg-black/70" />
      <Drawer.Popup className="fixed inset-x-0 bottom-0 mx-auto w-full max-w-lg rounded-t-2xl bg-gray-50 px-6 pb-6 pt-4 text-gray-900 shadow-lg">
        <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-gray-300" />
        <Drawer.Title className="mb-1 text-lg font-medium text-center">
          Notifications
        </Drawer.Title>
        <Drawer.Description className="mb-6 text-base text-gray-600 text-center">
          You are all caught up. Good job!
        </Drawer.Description>
        <div className="flex justify-center gap-4">
          <Drawer.Close className="flex h-10 items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3.5 text-base font-medium text-gray-900 select-none hover:bg-gray-100 focus-visible:outline focus-visible:-outline-offset-1 focus-visible:outline-blue-800 active:bg-gray-100">
            Close
          </Drawer.Close>
        </div>
        <label className="flex items-center justify-center gap-2 mt-4 text-sm">
          <input
            type="checkbox"
            checked={locked}
            onChange={(event) => setLocked(event.target.checked)}
          />
          Lock open state
        </label>
      </Drawer.Popup>
    </Drawer.Root>
  );
}
