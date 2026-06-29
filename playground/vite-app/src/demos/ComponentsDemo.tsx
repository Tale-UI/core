import { Button } from '@tale-ui/react/button';
import '@tale-ui/react-styles/index.css';

export default function ComponentsDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>@tale-ui/react components</h1>

      <section>
        <h2 style={{ margin: '0 0 1rem', fontSize: '0.875rem', fontWeight: 500, opacity: 0.6 }}>
          Button — variants
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button className="tale-button tale-button--primary">Primary</Button>
          <Button className="tale-button tale-button--neutral">Neutral</Button>
          <Button className="tale-button tale-button--ghost">Ghost</Button>
          <Button className="tale-button tale-button--danger">Danger</Button>
        </div>
      </section>

      <section>
        <h2 style={{ margin: '0 0 1rem', fontSize: '0.875rem', fontWeight: 500, opacity: 0.6 }}>
          Button — sizes
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button className="tale-button tale-button--primary tale-button--sm">Small</Button>
          <Button className="tale-button tale-button--primary tale-button--md">Medium</Button>
          <Button className="tale-button tale-button--primary tale-button--lg">Large</Button>
        </div>
      </section>

      <section>
        <h2 style={{ margin: '0 0 1rem', fontSize: '0.875rem', fontWeight: 500, opacity: 0.6 }}>
          Button — disabled
        </h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button disabled className="tale-button tale-button--primary">Primary</Button>
          <Button disabled className="tale-button tale-button--neutral">Neutral</Button>
          <Button disabled className="tale-button tale-button--ghost">Ghost</Button>
          <Button disabled className="tale-button tale-button--danger">Danger</Button>
        </div>
      </section>
    </div>
  );
}
