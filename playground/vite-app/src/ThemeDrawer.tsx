import * as React from 'react';
import { Card } from '@tale-ui/react/card';
import { Drawer } from '@tale-ui/react/drawer';
import {
  DEFAULT_STANDARD_THEME_ID,
  MONOCHROME_THEMES,
  MONOCHROME_THEME_ATTRIBUTE,
  STANDARD_THEMES,
  THEME_ATTRIBUTE,
  type MonochromeTheme,
  type StandardTheme,
} from '@tale-ui/themes';

type PlaygroundTheme = StandardTheme | MonochromeTheme;

const getShade = (
  theme: PlaygroundTheme,
  palette: 'brandPalette' | 'neutralPalette',
  shade: number,
) => theme[palette].find((color) => color.shade === shade)?.hex;

function ThemeOption({
  theme,
  isSelected,
  onPress,
}: {
  theme: PlaygroundTheme;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <Card.Button
      variant="outlined"
      padding="sm"
      className="pg-theme-card"
      isSelected={isSelected}
      onPress={onPress}
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
    </Card.Button>
  );
}

export function ThemeDrawer() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedStandardThemeId, setSelectedStandardThemeId] = React.useState(
    () => document.documentElement.getAttribute(THEME_ATTRIBUTE) ?? DEFAULT_STANDARD_THEME_ID,
  );
  const [selectedMonochromeThemeId, setSelectedMonochromeThemeId] = React.useState<string | null>(
    () => document.documentElement.getAttribute(MONOCHROME_THEME_ATTRIBUTE),
  );

  React.useEffect(() => {
    const onStandardThemeChange = (event: Event) => {
      const themeId = (event as CustomEvent<string | null>).detail;
      setSelectedStandardThemeId(themeId ?? 'custom');
    };
    const onMonochromeThemeChange = (event: Event) => {
      const themeId = (event as CustomEvent<string | null>).detail;
      setSelectedMonochromeThemeId(themeId);
    };

    window.addEventListener('scale:standard-theme-change', onStandardThemeChange);
    window.addEventListener('scale:monochrome-theme-change', onMonochromeThemeChange);
    return () => {
      window.removeEventListener('scale:standard-theme-change', onStandardThemeChange);
      window.removeEventListener('scale:monochrome-theme-change', onMonochromeThemeChange);
    };
  }, []);

  const selectedTheme =
    STANDARD_THEMES.find(({ id }) => id === selectedStandardThemeId) ??
    MONOCHROME_THEMES.find(({ id }) => id === selectedMonochromeThemeId);

  const applyStandardTheme = (themeId: string) => {
    setSelectedStandardThemeId(themeId);
    setSelectedMonochromeThemeId(null);
    window.dispatchEvent(new CustomEvent('scale:apply-standard-theme', { detail: themeId }));
    setIsOpen(false);
  };

  const applyMonochromeTheme = (themeId: string) => {
    setSelectedStandardThemeId('custom');
    setSelectedMonochromeThemeId(themeId);
    window.dispatchEvent(new CustomEvent('scale:apply-monochrome-theme', { detail: themeId }));
    setIsOpen(false);
  };

  return (
    <Drawer.Root className="pg-theme-drawer" open={isOpen} onOpenChange={setIsOpen}>
      <Drawer.Trigger
        className="tale-button tale-button--neutral tale-button--sm pg-theme-drawer__trigger"
        aria-label={`Themes, current theme ${selectedTheme?.name ?? 'Custom'}`}
      >
        Themes
        <span className="pg-theme-drawer__current">{selectedTheme?.name ?? 'Custom'}</span>
      </Drawer.Trigger>
      <Drawer.Backdrop />
      <Drawer.Popup className="pg-theme-drawer__popup" aria-label="Themes">
        <div className="pg-theme-drawer__header">
          <div>
            <Drawer.Title>Themes</Drawer.Title>
            <Drawer.Description>
              Apply algorithm-generated standard or monochrome palettes to every component demo.
            </Drawer.Description>
          </div>
          <Drawer.Close className="tale-button tale-button--ghost tale-button--sm">
            Close
          </Drawer.Close>
        </div>
        <section className="pg-theme-drawer__section" aria-labelledby="standard-themes-heading">
          <h3 id="standard-themes-heading" className="pg-theme-drawer__section-title">
            Standard themes
          </h3>
          <p className="pg-theme-drawer__section-description">
            Distinct brand and neutral colour anchors.
          </p>
          <div className="pg-theme-drawer__list" role="group" aria-label="Standard themes">
            {STANDARD_THEMES.map((theme) => (
              <ThemeOption
                key={theme.id}
                theme={theme}
                isSelected={theme.id === selectedStandardThemeId}
                onPress={() => applyStandardTheme(theme.id)}
              />
            ))}
          </div>
        </section>
        <section className="pg-theme-drawer__section" aria-labelledby="monochrome-themes-heading">
          <h3 id="monochrome-themes-heading" className="pg-theme-drawer__section-title">
            Monochrome themes
          </h3>
          <p className="pg-theme-drawer__section-description">
            Shared brand and neutral colour anchors.
          </p>
          <div className="pg-theme-drawer__list" role="group" aria-label="Monochrome themes">
            {MONOCHROME_THEMES.map((theme) => (
              <ThemeOption
                key={theme.id}
                theme={theme}
                isSelected={theme.id === selectedMonochromeThemeId}
                onPress={() => applyMonochromeTheme(theme.id)}
              />
            ))}
          </div>
        </section>
        <p className="pg-theme-drawer__footer">
          Fine-tune the active palette in the Theme Playground.
        </p>
      </Drawer.Popup>
    </Drawer.Root>
  );
}
