# Emoji Picker

A searchable virtualized emoji picker built from Tale UI primitives. Production apps should pass their own emoji data, for example from `emojibase-data`, normalized into the `EmojiItem` shape shown below.

## Components Used

- `Popover` from `@tale-ui/react/popover`
- `SearchField` from `@tale-ui/react/search-field`
- `ListBox` from `@tale-ui/react/list-box`
- `Virtualizer`, `GridLayout`, and `Size` from `@tale-ui/react/virtualizer`
- `Text` from `@tale-ui/react/text`

## Code

```tsx
import * as React from 'react';
import { ListBox } from '@tale-ui/react/list-box';
import { Popover } from '@tale-ui/react/popover';
import { SearchField } from '@tale-ui/react/search-field';
import { Text } from '@tale-ui/react/text';
import { Virtualizer, GridLayout, Size } from '@tale-ui/react/virtualizer';

type EmojiItem = {
  id: string;
  emoji: string;
  label: string;
  group: string;
  keywords?: string[];
};

const emojis: EmojiItem[] = [
  { id: 'grinning', emoji: '😀', label: 'Grinning face', group: 'Smileys', keywords: ['happy', 'smile'] },
  { id: 'laughing', emoji: '😄', label: 'Laughing face', group: 'Smileys', keywords: ['happy', 'laugh'] },
  { id: 'heart-eyes', emoji: '😍', label: 'Heart eyes', group: 'Smileys', keywords: ['love', 'heart'] },
  { id: 'party', emoji: '🥳', label: 'Party face', group: 'Smileys', keywords: ['celebrate', 'birthday'] },
  { id: 'thumbs-up', emoji: '👍', label: 'Thumbs up', group: 'People', keywords: ['approve', 'yes'] },
  { id: 'clap', emoji: '👏', label: 'Clapping hands', group: 'People', keywords: ['applause', 'great'] },
  { id: 'rocket', emoji: '🚀', label: 'Rocket', group: 'Objects', keywords: ['launch', 'ship'] },
  { id: 'sparkles', emoji: '✨', label: 'Sparkles', group: 'Symbols', keywords: ['shine', 'magic'] },
];

export function EmojiPickerExample() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [selectedEmoji, setSelectedEmoji] = React.useState<EmojiItem | null>(null);

  const filteredEmojis = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return emojis;
    }

    return emojis.filter((item) => {
      const searchable = [
        item.label,
        item.group,
        ...(item.keywords ?? []),
      ].join(' ').toLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [query]);

  function selectEmoji(key: React.Key | null) {
    const emoji = filteredEmojis.find((item) => item.id === key);
    if (!emoji) {
      return;
    }

    setSelectedEmoji(emoji);
    setIsOpen(false);
  }

  return (
    <Popover.Root isOpen={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger className="tale-button tale-button--neutral tale-button--md">
        {selectedEmoji ? `${selectedEmoji.emoji} ${selectedEmoji.label}` : 'Choose emoji'}
      </Popover.Trigger>
      <Popover.Popup aria-label="Emoji picker" placement="bottom start" offset={8}>
        <SearchField.Root aria-label="Search emoji" value={query} onChange={setQuery}>
          <SearchField.Input placeholder="Search emoji..." />
          <SearchField.ClearButton />
        </SearchField.Root>

        {filteredEmojis.length > 0 ? (
          <Virtualizer
            layout={GridLayout}
            layoutOptions={{
              minItemSize: new Size(44, 44),
              maxItemSize: new Size(44, 44),
              minSpace: new Size(4, 4),
              preserveAspectRatio: true,
            }}
          >
            <ListBox.Root
              aria-label="Emoji results"
              items={filteredEmojis}
              layout="grid"
              selectionMode="single"
              selectedKeys={selectedEmoji ? [selectedEmoji.id] : []}
              onSelectionChange={(keys) => {
                const key = keys === 'all' ? null : [...keys][0] ?? null;
                selectEmoji(key);
              }}
            >
              {(item) => (
                <ListBox.Item id={item.id} textValue={item.label}>
                  {item.emoji}
                </ListBox.Item>
              )}
            </ListBox.Root>
          </Virtualizer>
        ) : (
          <Text as="div" color="muted">
            No emoji found.
          </Text>
        )}
      </Popover.Popup>
    </Popover.Root>
  );
}
```

## Customization Points

- Replace the inline `emojis` array with your application data source.
- Normalize external emoji datasets into `{ id, emoji, label, group, keywords }`.
- Tune `GridLayout` sizing for larger or denser emoji cells.
- Store recent or frequently used emoji in application state and render them as a separate section.
