import React from 'react'
import styled from 'styled-components'
import { Button } from '@tale-ui/react-styled/button'
import { Checkbox } from '@tale-ui/react-styled/checkbox'
import { Switch } from '@tale-ui/react-styled/switch'
import { Input } from '@tale-ui/react-styled/input'
import { Slider } from '@tale-ui/react-styled/slider'

const PREVIEW_SHADES = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

const CheckIcon = () => (
  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="2,6 5,9 10,3" />
  </svg>
)

const Root = styled.div`
  height: 100%;
`

const Header = styled.div`
  font-size: var(--label-s-font-size);
  font-weight: var(--label-font-weight);
  line-height: var(--label-line-height);
  margin-bottom: var(--space-m);
`

const PreviewBox = styled.div`
  border: 1px solid var(--neutral-20);
  border-radius: var(--radius-l);
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
`

const SectionLabel = styled.p`
  font-size: var(--label-s-font-size);
  font-weight: var(--label-font-weight);
  color: var(--neutral-60);
  margin: 0 0 var(--space-s);
`

const ScaleStrip = ({ prefix, label }) => (
  <section>
    <SectionLabel>{label}</SectionLabel>
    <div style={{ display: 'flex', gap: '3px' }}>
      {PREVIEW_SHADES.map(shade => (
        <div key={shade} style={{ flex: 1 }}>
          <div style={{
            height: '48px',
            background: `var(--${prefix}-${shade})`,
            color: `var(--${prefix}-${shade}-fg)`,
            borderRadius: 'var(--radius-s)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            fontFamily: 'monospace',
            fontWeight: 600,
          }}>
            {shade}
          </div>
        </div>
      ))}
    </div>
  </section>
)

const ComponentPreview = ({ namedName, neutralName }) => {
  return (
    <Root>
      <Header>Component Preview</Header>
      <PreviewBox className={`neutral-${neutralName || 'neutral'} color-${namedName || 'color'}`}>

        {/* Named color scale */}
        <ScaleStrip prefix="color" label="--color-* (named)" />

        {/* Neutral scale */}
        <ScaleStrip prefix="neutral" label="--neutral-* (neutral)" />

        {/* Buttons */}
        <section>
          <SectionLabel>Buttons</SectionLabel>
          <div style={{ display: 'flex', gap: 'var(--space-s)', flexWrap: 'wrap', alignItems: 'center' }}>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="neutral" size="md">Neutral</Button>
            <Button variant="ghost" size="md">Ghost</Button>
            <Button variant="primary" size="md" disabled>Disabled</Button>
          </div>
        </section>

        {/* Form controls */}
        <section>
          <SectionLabel>Form controls</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)', maxWidth: '360px' }}>
            <Input placeholder="Input field…" size="md" />
            <div style={{ display: 'flex', gap: 'var(--space-xl)', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)' }}>
                <Checkbox.Root defaultChecked>
                  <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
                </Checkbox.Root>
                <span style={{ fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>Checked</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)' }}>
                <Checkbox.Root>
                  <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
                </Checkbox.Root>
                <span style={{ fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>Unchecked</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-s)' }}>
                <Switch.Root defaultChecked>
                  <Switch.Thumb />
                </Switch.Root>
                <span style={{ fontSize: 'var(--label-m-font-size)', color: 'var(--neutral-80)' }}>Switch</span>
              </div>
            </div>
            <Slider.Root defaultValue={[40]} min={0} max={100}>
              <Slider.Control>
                <Slider.Track>
                  <Slider.Indicator />
                  <Slider.Thumb />
                </Slider.Track>
              </Slider.Control>
            </Slider.Root>
          </div>
        </section>

      </PreviewBox>
    </Root>
  )
}

export default ComponentPreview
