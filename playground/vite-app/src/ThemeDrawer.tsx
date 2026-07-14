import * as React from 'react';
import { Drawer } from '@tale-ui/react/drawer';
import { DEFAULT_THEME_ID, THEMES, type PlaygroundTheme } from '@tale-ui/playground-scale/themes';

const getShade = (
  theme: PlaygroundTheme,
  palette: 'brandPalette' | 'neutralPalette',
  shade: number,
) => theme[palette].find((color) => color.shade === shade)?.hex;

export function ThemeDrawer() {
  const [selectedThemeId, setSelectedThemeId] = React.useState(
    () => document.documentElement.dataset.playgroundTheme ?? DEFAULT_THEME_ID,
  );

  React.useEffect(() => {
    const onThemeChange = (event: Event) => {
      const themeId = (event as CustomEvent<string | null>).detail;
      setSelectedThemeId(themeId ?? 'custom');
    };

    window.addEventListener('scale:theme-change', onThemeChange);
    return () => window.removeEventListener('scale:theme-change', onThemeChange);
  }, []);

  const selectedTheme = THEMES.find(({ id }) => id === selectedThemeId);

  const applyTheme = (themeId: string) => {
    setSelectedThemeId(themeId);
    window.dispatchEvent(new CustomEvent('scale:apply-theme', { detail: themeId }));
  };

  return (
    <Drawer.Root className="pg-theme-drawer">
      <Drawer.Trigger
        className="tale-button tale-button--neutral tale-button--sm pg-theme-drawer__trigger"
        aria-label={`Themes, current theme ${selectedTheme?.name ?? 'Custom'}`}
      >
        Themes
        <span className="pg-theme-drawer__current">{selectedTheme?.name ?? 'Custom'}</span>
      </Drawer.Trigger>
      <Drawer.Backdrop />
      <Drawer.Popup className="pg-theme-drawer__popup" aria-label="Playground themes">
        <div className="pg-theme-drawer__header">
          <div>
            <Drawer.Title>Playground themes</Drawer.Title>
            <Drawer.Description>
              Apply an algorithm-generated brand and neutral palette to every component demo.
            </Drawer.Description>
          </div>
          <Drawer.Close className="tale-button tale-button--ghost tale-button--sm">
            Close
          </Drawer.Close>
        </div>
        <div className="pg-theme-drawer__list">
          {THEMES.map((theme) => {
            const isSelected = theme.id === selectedThemeId;
            return (
              <Drawer.Close
                key={theme.id}
                className="pg-theme-card"
                data-selected={isSelected ? '' : undefined}
                aria-pressed={isSelected}
                onClick={() => applyTheme(theme.id)}
              >
                <span className="pg-theme-card__swatches" aria-hidden="true">
                  {[20, 60, 90].map((shade) => (
                    <span
                      key={`brand-${shade}`}
                      style={{ backgroundColor: getShade(theme, 'brandPalette', shade) }}
                    />
                  ))}
                  {[20, 60, 90].map((shade) => (
                    <span
                      key={`neutral-${shade}`}
                      style={{ backgroundColor: getShade(theme, 'neutralPalette', shade) }}
                    />
                  ))}
                </span>
                <span className="pg-theme-card__copy">
                  <span className="pg-theme-card__name">
                    {theme.name}
                    {isSelected && <span className="pg-theme-card__selected">Applied</span>}
                  </span>
                  <span className="pg-theme-card__description">{theme.description}</span>
                </span>
              </Drawer.Close>
            );
          })}
        </div>
        <p className="pg-theme-drawer__footer">
          Fine-tune the active palette in the Theme Playground.
        </p>
      </Drawer.Popup>
    </Drawer.Root>
  );
}
