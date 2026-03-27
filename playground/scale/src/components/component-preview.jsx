import React from 'react'
import styled from 'styled-components'
import { Button } from '@tale-ui/react/button'
import { Checkbox } from '@tale-ui/react/checkbox'
import { Switch } from '@tale-ui/react/switch'
import { Input } from '@tale-ui/react/input'
import { Slider } from '@tale-ui/react/slider'
import { Radio } from '@tale-ui/react/radio'
import { Tabs } from '@tale-ui/react/tabs'
import { ToggleButton, ToggleButtonGroup } from '@tale-ui/react/toggle-button'
import { ProgressBar } from '@tale-ui/react/progress-bar'
import { Meter } from '@tale-ui/react/meter'
import { Select } from '@tale-ui/react/select'
import { Link } from '@tale-ui/react/link'
import { Separator } from '@tale-ui/react/separator'
import { Avatar } from '@tale-ui/react/avatar'
import { TagGroup } from '@tale-ui/react/tag-group'
import { Breadcrumbs } from '@tale-ui/react/breadcrumbs'
import { Accordion } from '@tale-ui/react/accordion'
import { Tooltip } from '@tale-ui/react/tooltip'
import { NumberField } from '@tale-ui/react/number-field'
import { SearchField } from '@tale-ui/react/search-field'
import { GridList } from '@tale-ui/react/grid-list'
import { Icon } from '@tale-ui/react/icon'
import { IconButton } from '@tale-ui/react/icon-button'
import { Badge } from '@tale-ui/react/badge'
import { DotIcon } from '@tale-ui/react/dot-icon'
import { TextField } from '@tale-ui/react/text-field'
import { TextArea } from '@tale-ui/react/text-area'
import { Banner } from '@tale-ui/react/banner'
import { Spinner } from '@tale-ui/react/spinner'
import { RatingStars } from '@tale-ui/react/rating-stars'
import { Table } from '@tale-ui/react/table'
import { Menu } from '@tale-ui/react/menu'
import { Disclosure } from '@tale-ui/react/disclosure'
import { Calendar } from '@tale-ui/react/calendar'
import { Pagination } from '@tale-ui/react/pagination'
import { Check, Heart, Star, Bell, Plus, Download, Settings, Trash2, Search, Info, AlertTriangle, CheckCircle2, XCircle, MoreHorizontal } from 'lucide-react'

const PREVIEW_SHADES = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

const CheckIcon = () => <Check width={12} height={12} />

const Root = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`

const Header = styled.div`
  font-size: var(--label-s-font-size);
  font-weight: var(--label-font-weight);
  line-height: var(--label-line-height);
  margin-bottom: var(--space-xs);
`

const PreviewBox = styled.div`
  border: 1px solid var(--neutral-20);
  border-radius: var(--radius-l);
  padding: var(--space-l);
  display: flex;
  flex-direction: column;
  gap: var(--space-m);
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`

const SectionLabel = styled.p`
  font-size: var(--label-s-font-size);
  font-weight: var(--label-font-weight);
  color: var(--neutral-60);
  margin: 0 0 var(--space-xs);
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-m);

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`

const ScaleStrip = ({ prefix, label }) => (
  <section>
    <SectionLabel>{label}</SectionLabel>
    <div style={{ display: 'flex', gap: '2px' }}>
      {PREVIEW_SHADES.map(shade => (
        <div key={shade} style={{ flex: 1 }}>
          <div style={{
            height: 'var(--space-l)',
            background: `var(--${prefix}-${shade})`,
            color: `var(--${prefix}-${shade}-fg)`,
            borderRadius: 'var(--radius-s)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'var(--mono-xs-font-size, 9px)',
            fontFamily: 'var(--mono-font-family)',
            fontWeight: 'var(--label-font-weight)',
          }}>
            {shade}
          </div>
        </div>
      ))}
    </div>
  </section>
)

const ComponentPreview = () => {
  return (
    <Root>
      <Header>Component Preview</Header>
      <PreviewBox>

        {/* Color scales side by side */}
        <Grid>
          <ScaleStrip prefix="color" label="--color-*" />
          <ScaleStrip prefix="neutral" label="--neutral-*" />
        </Grid>

        {/* Buttons + Toggle buttons side by side */}
        <Grid>
          <section>
            <SectionLabel>Buttons</SectionLabel>
            <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant="primary" size="sm">Primary</Button>
              <Button variant="neutral" size="sm">Neutral</Button>
              <Button variant="inverse" size="sm">Inverse</Button>
              <Button variant="ghost" size="sm">Ghost</Button>
              <Button variant="danger" size="sm">Danger</Button>
              <Button variant="primary" size="sm" disabled>Disabled</Button>
            </div>
          </section>
          <section>
            <SectionLabel>Toggle buttons</SectionLabel>
            <div style={{ display: 'flex', gap: 'var(--space-s)', flexWrap: 'wrap', alignItems: 'center' }}>
              <ToggleButtonGroup selectionMode="single" defaultSelectedKeys={['center']} disallowEmptySelection>
                <ToggleButton id="left" size="sm">Left</ToggleButton>
                <ToggleButton id="center" size="sm">Center</ToggleButton>
                <ToggleButton id="right" size="sm">Right</ToggleButton>
              </ToggleButtonGroup>
              <ToggleButton size="sm" defaultSelected>Solo</ToggleButton>
            </div>
          </section>
        </Grid>

        {/* Icons */}
        <Grid>
          <section>
            <SectionLabel>Icons</SectionLabel>
            <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Icon icon={Heart} size="sm" />
              <Icon icon={Star} size="sm" />
              <Icon icon={Bell} size="sm" />
              <Icon icon={Settings} size="sm" />
              <Icon icon={Plus} size="sm" />
              <Icon icon={Download} size="sm" />
              <Icon icon={Trash2} size="sm" />
            </div>
          </section>
          <section>
            <SectionLabel>Icons in buttons</SectionLabel>
            <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Button variant="primary" size="sm"><Icon icon={Plus} size="sm" /> Add</Button>
              <Button variant="neutral" size="sm"><Icon icon={Download} size="sm" /> Save</Button>
              <Button variant="danger" size="sm"><Icon icon={Trash2} size="sm" /> Delete</Button>
            </div>
          </section>
        </Grid>

        {/* Badge + DotIcon + IconButton */}
        <Grid>
          <section>
            <SectionLabel>Badges & Dots</SectionLabel>
            <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Badge variant="brand">Brand</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="neutral">Neutral</Badge>
              <DotIcon color="brand" />
              <DotIcon color="error" />
              <DotIcon color="warning" />
              <DotIcon color="success" />
            </div>
          </section>
          <section>
            <SectionLabel>Icon buttons</SectionLabel>
            <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', alignItems: 'center' }}>
              <IconButton variant="primary" size="sm" aria-label="Search"><Icon icon={Search} size="sm" /></IconButton>
              <IconButton variant="neutral" size="sm" aria-label="Settings"><Icon icon={Settings} size="sm" /></IconButton>
              <IconButton variant="ghost" size="sm" aria-label="More"><Icon icon={MoreHorizontal} size="sm" /></IconButton>
              <IconButton variant="danger" size="sm" aria-label="Delete"><Icon icon={Trash2} size="sm" /></IconButton>
            </div>
          </section>
        </Grid>

        {/* Form controls + Radio / Select in two columns */}
        <Grid>
          <section>
            <SectionLabel>Form controls</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-s)' }}>
              <Input.Root>
                <Input.Input placeholder="Input field…" size="sm" />
              </Input.Root>
              <div style={{ display: 'flex', gap: 'var(--space-m)', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                  <Checkbox.Root defaultSelected>
                    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
                  </Checkbox.Root>
                  <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-80)' }}>On</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                  <Checkbox.Root>
                    <Checkbox.Indicator><CheckIcon /></Checkbox.Indicator>
                  </Checkbox.Root>
                  <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-80)' }}>Off</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                  <Switch.Root defaultSelected>
                    <Switch.Thumb />
                  </Switch.Root>
                  <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-80)' }}>Switch</span>
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
          <section>
            <SectionLabel>Radio & Select</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-s)' }}>
              <Radio.Group defaultValue="option-b">
                <div style={{ display: 'flex', gap: 'var(--space-m)', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                    <Radio.Root value="option-a"><Radio.Indicator /></Radio.Root>
                    <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-80)' }}>A</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                    <Radio.Root value="option-b"><Radio.Indicator /></Radio.Root>
                    <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-80)' }}>B</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }}>
                    <Radio.Root value="option-c"><Radio.Indicator /></Radio.Root>
                    <span style={{ fontSize: 'var(--label-s-font-size)', color: 'var(--neutral-80)' }}>C</span>
                  </div>
                </div>
              </Radio.Group>
              <Select.Root placeholder="Choose…">
                <Select.Trigger>
                  <Select.Value />
                  <Select.Icon />
                </Select.Trigger>
                <Select.Popover>
                  <Select.ListBox>
                    <Select.Item id="apple">Apple</Select.Item>
                    <Select.Item id="banana">Banana</Select.Item>
                    <Select.Item id="cherry">Cherry</Select.Item>
                  </Select.ListBox>
                </Select.Popover>
              </Select.Root>
            </div>
          </section>
        </Grid>

        {/* Search + Number field side by side */}
        <Grid>
          <section>
            <SectionLabel>Search field</SectionLabel>
            <SearchField.Root>
              <SearchField.Input placeholder="Search…" />
              <SearchField.ClearButton />
            </SearchField.Root>
          </section>
          <section>
            <SectionLabel>Number field</SectionLabel>
            <NumberField.Root defaultValue={5} minValue={0} maxValue={100}>
              <NumberField.Group>
                <NumberField.Decrement />
                <NumberField.Input />
                <NumberField.Increment />
              </NumberField.Group>
            </NumberField.Root>
          </section>
        </Grid>

        {/* TextField + TextArea */}
        <Grid>
          <section>
            <SectionLabel>Text field</SectionLabel>
            <TextField.Root>
              <TextField.Label>Full name</TextField.Label>
              <TextField.Input placeholder="Enter your name" />
              <TextField.Description>As it appears on your ID.</TextField.Description>
            </TextField.Root>
          </section>
          <section>
            <SectionLabel>Text area</SectionLabel>
            <TextArea.Root>
              <TextArea.Label>Notes</TextArea.Label>
              <TextArea.TextArea placeholder="Write something…" rows={2} />
            </TextArea.Root>
          </section>
        </Grid>

        {/* Tabs full width */}
        <section>
          <SectionLabel>Tabs</SectionLabel>
          <Tabs.Root defaultSelectedKey="tab1">
            <Tabs.List>
              <Tabs.Tab id="tab1">Overview</Tabs.Tab>
              <Tabs.Tab id="tab2">Details</Tabs.Tab>
              <Tabs.Tab id="tab3">Settings</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel id="tab1">
              <p style={{ fontSize: 'var(--text-s-font-size)', color: 'var(--neutral-70)', margin: 'var(--space-xs) 0 0' }}>Overview panel content</p>
            </Tabs.Panel>
            <Tabs.Panel id="tab2">
              <p style={{ fontSize: 'var(--text-s-font-size)', color: 'var(--neutral-70)', margin: 'var(--space-xs) 0 0' }}>Details panel content</p>
            </Tabs.Panel>
            <Tabs.Panel id="tab3">
              <p style={{ fontSize: 'var(--text-s-font-size)', color: 'var(--neutral-70)', margin: 'var(--space-xs) 0 0' }}>Settings panel content</p>
            </Tabs.Panel>
          </Tabs.Root>
        </section>

        {/* Accordion full width */}
        <section>
          <SectionLabel>Accordion</SectionLabel>
          <Accordion.Root defaultExpandedKeys={['faq1']}>
            <Accordion.Item id="faq1">
              <Accordion.Header>
                <Accordion.Trigger>What is this tool?</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel>
                <p style={{ fontSize: 'var(--text-s-font-size)', color: 'var(--neutral-70)', margin: 0 }}>
                  A colour scale generator for the Tale UI design system.
                </p>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item id="faq2">
              <Accordion.Header>
                <Accordion.Trigger>How does dark mode work?</Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Panel>
                <p style={{ fontSize: 'var(--text-s-font-size)', color: 'var(--neutral-70)', margin: 0 }}>
                  The scale mirrors automatically — shade 60 in dark mode shows the palette's shade 40.
                </p>
              </Accordion.Panel>
            </Accordion.Item>
          </Accordion.Root>
        </section>

        {/* Banners */}
        <section>
          <SectionLabel>Banners</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
            <Banner.Root variant="info" size="sm">
              <Banner.Icon><Icon icon={Info} size="sm" /></Banner.Icon>
              <Banner.Title>Information banner</Banner.Title>
            </Banner.Root>
            <Banner.Root variant="success" size="sm">
              <Banner.Icon><Icon icon={CheckCircle2} size="sm" /></Banner.Icon>
              <Banner.Title>Success banner</Banner.Title>
            </Banner.Root>
            <Banner.Root variant="warning" size="sm">
              <Banner.Icon><Icon icon={AlertTriangle} size="sm" /></Banner.Icon>
              <Banner.Title>Warning banner</Banner.Title>
            </Banner.Root>
            <Banner.Root variant="error" size="sm">
              <Banner.Icon><Icon icon={XCircle} size="sm" /></Banner.Icon>
              <Banner.Title>Error banner</Banner.Title>
            </Banner.Root>
          </div>
        </section>

        {/* Spinner + Rating stars */}
        <Grid>
          <section>
            <SectionLabel>Spinners</SectionLabel>
            <div style={{ display: 'flex', gap: 'var(--space-m)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Spinner variant="circle" size="sm" />
              <Spinner variant="circle" size="md" />
              <Spinner variant="dots" size="sm" />
              <Spinner variant="line" size="sm" />
            </div>
          </section>
          <section>
            <SectionLabel>Rating stars</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
              <RatingStars value={4} max={5} size="md" />
              <RatingStars value={2.5} max={5} size="sm" />
            </div>
          </section>
        </Grid>

        {/* Progress / Meter + Tags / Avatars */}
        <Grid>
          <section>
            <SectionLabel>Progress & Meter</SectionLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-s)' }}>
              <ProgressBar.Root value={65}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4xs)' }}>
                  <ProgressBar.Label style={{ fontSize: 'var(--label-s-font-size)' }}>Uploading…</ProgressBar.Label>
                  <ProgressBar.Value style={{ fontSize: 'var(--label-s-font-size)' }} />
                </div>
                <ProgressBar.Track>
                  <ProgressBar.Indicator value={65} />
                </ProgressBar.Track>
              </ProgressBar.Root>
              <Meter.Root value={40}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4xs)' }}>
                  <Meter.Label style={{ fontSize: 'var(--label-s-font-size)' }}>Storage</Meter.Label>
                  <Meter.Value style={{ fontSize: 'var(--label-s-font-size)' }} />
                </div>
                <Meter.Track>
                  <Meter.Indicator value={40} />
                </Meter.Track>
              </Meter.Root>
            </div>
          </section>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-m)' }}>
            <section>
              <SectionLabel>Tags</SectionLabel>
              <TagGroup.Root selectionMode="multiple" defaultSelectedKeys={['design']}>
                <TagGroup.List>
                  <TagGroup.Tag id="design">Design</TagGroup.Tag>
                  <TagGroup.Tag id="dev">Development</TagGroup.Tag>
                  <TagGroup.Tag id="docs">Docs</TagGroup.Tag>
                </TagGroup.List>
              </TagGroup.Root>
            </section>
            <section>
              <SectionLabel>Avatars</SectionLabel>
              <div style={{ display: 'flex', gap: 'var(--space-xs)', alignItems: 'center' }}>
                <Avatar.Root size="sm"><Avatar.Fallback>S</Avatar.Fallback></Avatar.Root>
                <Avatar.Root size="md"><Avatar.Fallback>M</Avatar.Fallback></Avatar.Root>
                <Avatar.Root size="lg"><Avatar.Fallback>L</Avatar.Fallback></Avatar.Root>
                <Avatar.Root size="xl"><Avatar.Fallback>XL</Avatar.Fallback></Avatar.Root>
              </div>
            </section>
          </div>
        </Grid>

        {/* Grid list + Tooltips */}
        <Grid>
          <section>
            <SectionLabel>Grid list</SectionLabel>
            <GridList.Root aria-label="Items" selectionMode="multiple" defaultSelectedKeys={['item-2']}>
              <GridList.Item id="item-1">Design tokens</GridList.Item>
              <GridList.Item id="item-2">Components</GridList.Item>
              <GridList.Item id="item-3">Documentation</GridList.Item>
            </GridList.Root>
          </section>
          <section>
            <SectionLabel>Tooltips</SectionLabel>
            <div style={{ display: 'flex', gap: 'var(--space-s)', flexWrap: 'wrap', alignItems: 'center' }}>
              <Tooltip.Root>
                <Tooltip.Trigger className="tale-button tale-button--neutral tale-button--sm">Hover me</Tooltip.Trigger>
                <Tooltip.Popup placement="top" offset={6}>
                  <Tooltip.Arrow />
                  Tooltip content
                </Tooltip.Popup>
              </Tooltip.Root>
              <Tooltip.Root>
                <Tooltip.Trigger className="tale-button tale-button--ghost tale-button--sm">Another</Tooltip.Trigger>
                <Tooltip.Popup placement="bottom" offset={6}>
                  <Tooltip.Arrow />
                  Bottom tooltip
                </Tooltip.Popup>
              </Tooltip.Root>
            </div>
          </section>
        </Grid>

        {/* Table */}
        <section>
          <SectionLabel>Table</SectionLabel>
          <Table.Root aria-label="People" selectionMode="multiple" defaultSelectedKeys={['r2']}>
            <Table.Header>
              <Table.Column isRowHeader>Name</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>
            <Table.Body>
              <Table.Row id="r1">
                <Table.Cell>Alice</Table.Cell>
                <Table.Cell>Engineer</Table.Cell>
                <Table.Cell><Badge variant="success" size="sm">Active</Badge></Table.Cell>
              </Table.Row>
              <Table.Row id="r2">
                <Table.Cell>Bob</Table.Cell>
                <Table.Cell>Designer</Table.Cell>
                <Table.Cell><Badge variant="brand" size="sm">Active</Badge></Table.Cell>
              </Table.Row>
              <Table.Row id="r3">
                <Table.Cell>Carol</Table.Cell>
                <Table.Cell>Manager</Table.Cell>
                <Table.Cell><Badge variant="neutral" size="sm">Away</Badge></Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </section>

        {/* Menu + Disclosure */}
        <Grid>
          <section>
            <SectionLabel>Menu</SectionLabel>
            <Menu.Root>
              <Menu.Trigger className="tale-button tale-button--neutral tale-button--sm">
                <Icon icon={MoreHorizontal} size="sm" /> Options
              </Menu.Trigger>
              <Menu.Popover>
                <Menu.MenuList>
                  <Menu.Item id="edit">Edit</Menu.Item>
                  <Menu.Item id="duplicate">Duplicate</Menu.Item>
                  <Menu.Separator />
                  <Menu.Item id="delete">Delete</Menu.Item>
                </Menu.MenuList>
              </Menu.Popover>
            </Menu.Root>
          </section>
          <section>
            <SectionLabel>Disclosure</SectionLabel>
            <Disclosure.Root>
              <Disclosure.Trigger>Show details</Disclosure.Trigger>
              <Disclosure.Panel>
                <p style={{ fontSize: 'var(--text-s-font-size)', color: 'var(--neutral-70)', margin: 0 }}>
                  Additional details revealed on expand.
                </p>
              </Disclosure.Panel>
            </Disclosure.Root>
          </section>
        </Grid>

        {/* Calendar */}
        <section>
          <SectionLabel>Calendar</SectionLabel>
          <Calendar.Root>
            <Calendar.Header>
              <Calendar.PreviousButton />
              <Calendar.Heading />
              <Calendar.NextButton />
            </Calendar.Header>
            <Calendar.Grid>
              <Calendar.GridHeader>
                {day => <Calendar.GridHeaderCell>{day}</Calendar.GridHeaderCell>}
              </Calendar.GridHeader>
              <Calendar.GridBody>
                {date => <Calendar.Cell date={date} />}
              </Calendar.GridBody>
            </Calendar.Grid>
          </Calendar.Root>
        </section>

        {/* Breadcrumbs + Links + Pagination — compact bottom row */}
        <Separator />
        <div style={{ display: 'flex', gap: 'var(--space-l)', alignItems: 'center', flexWrap: 'wrap' }}>
          <Breadcrumbs.Root>
            <Breadcrumbs.Item><Breadcrumbs.Link href="#">Home</Breadcrumbs.Link></Breadcrumbs.Item>
            <Breadcrumbs.Item><Breadcrumbs.Link href="#">Library</Breadcrumbs.Link></Breadcrumbs.Item>
            <Breadcrumbs.Item><Breadcrumbs.Link>Current</Breadcrumbs.Link></Breadcrumbs.Item>
          </Breadcrumbs.Root>
          <Separator orientation="vertical" style={{ alignSelf: 'stretch' }} />
          <div style={{ display: 'flex', gap: 'var(--space-s)', alignItems: 'center' }}>
            <Button variant="primary" size="sm">Save</Button>
            <Button variant="ghost" size="sm">Cancel</Button>
            <Link href="#">Learn more</Link>
          </div>
        </div>

        {/* Pagination */}
        <section>
          <SectionLabel>Pagination</SectionLabel>
          <Pagination.Root aria-label="Pages">
            <Pagination.PreviousTrigger />
            <Pagination.Item page={1} />
            <Pagination.Item page={2} current />
            <Pagination.Item page={3} />
            <Pagination.Ellipsis />
            <Pagination.Item page={10} />
            <Pagination.NextTrigger />
          </Pagination.Root>
        </section>

      </PreviewBox>
    </Root>
  )
}

export default ComponentPreview
