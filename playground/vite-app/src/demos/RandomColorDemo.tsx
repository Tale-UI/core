import * as React from 'react';
import { Button } from '@tale-ui/react/button';
import { Container } from '@tale-ui/react/container';
import { randomBaseColor, generatePalette } from '@tale-ui/utils/color';
import '@tale-ui/react-styles/index.css';

function makeRandomVars(): React.CSSProperties {
  const base = randomBaseColor('named');
  const palette = generatePalette(base, 'named');
  return Object.fromEntries(palette.map(({ shade, hex }) => [`--color-${shade}`, hex]));
}

export default function RandomColorDemo() {
  const [colorVars, setColorVars] = React.useState<React.CSSProperties>(makeRandomVars);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.6rem' }}>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 600 }}>Random color demo</h1>
        <Button
          className="tale-button tale-button--neutral tale-button--sm"
          onClick={() => setColorVars(makeRandomVars())}
        >
          Randomize
        </Button>
      </div>
      <p style={{ margin: 0, fontSize: '1.4rem', opacity: 0.6 }}>
        A WCAG-validated color palette is picked randomly. All{' '}
        <code>--color-*</code> variables inside the container update automatically.
      </p>

      <Container color="brand" style={{ ...colorVars, padding: '2.4rem', borderRadius: '1.2rem', background: 'var(--color-5)', display: 'flex', flexDirection: 'column', gap: '2.4rem' }}>
        <section>
          <h2 style={{ margin: '0 0 1.6rem', fontSize: '1.4rem', fontWeight: 500, color: 'var(--color-80)' }}>
            Button — variants
          </h2>
          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button className="tale-button tale-button--primary">Primary</Button>
            <Button className="tale-button tale-button--neutral">Neutral</Button>
            <Button className="tale-button tale-button--ghost">Ghost</Button>
            <Button className="tale-button tale-button--danger">Danger</Button>
          </div>
        </section>

        <section>
          <h2 style={{ margin: '0 0 1.6rem', fontSize: '1.4rem', fontWeight: 500, color: 'var(--color-80)' }}>
            Button — sizes
          </h2>
          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button className="tale-button tale-button--primary tale-button--sm">Small</Button>
            <Button className="tale-button tale-button--primary tale-button--md">Medium</Button>
            <Button className="tale-button tale-button--primary tale-button--lg">Large</Button>
          </div>
        </section>

        <section>
          <h2 style={{ margin: '0 0 1.6rem', fontSize: '1.4rem', fontWeight: 500, color: 'var(--color-80)' }}>
            Palette swatches
          </h2>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(shade => (
              <div
                key={shade}
                style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '0.6rem',
                  background: `var(--color-${shade})`,
                }}
                title={`--color-${shade}`}
              />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
