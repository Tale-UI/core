import { Menu } from '@tale-ui/react/menu';
import { Tooltip } from '@tale-ui/react/tooltip';
import { Popover } from '@tale-ui/react/popover';
import { Dialog } from '@tale-ui/react/dialog';
import { PreviewCard } from '@tale-ui/react/preview-card';
import PerformanceBenchmark from './utils/benchmark';
import { type Settings, SettingsPanel, usePersistedSettings } from './SettingsPanel';
import styles from './perf.module.css';
// docs/ was removed from this fork — stubs keep the perf benchmarks functional without styling
const menuDemoStyles: Record<string, string> = {};
const tooltipDemoStyles: Record<string, string> = {};
const popoverDemoStyles: Record<string, string> = {};
const dialogDemoStyles: Record<string, string> = {};
const previewCardDemoStyles: Record<string, string> = {};

interface RowData {
  label: string;
  index: number;
}

interface RowProps {
  rowData: RowData;
}

const rowCount = 500;
const menuItemCount = 50;

const rows = Array.from({ length: rowCount }).map((_, i) => ({
  label: `Row ${i + 1}`,
  index: i + 1,
}));

const menuItems = Array.from({ length: menuItemCount }).map((_, i) => ({
  label: `Menu Item ${i + 1}`,
  index: i + 1,
}));

export default function PerfExperiment() {
  const [settings, setSettings] = usePersistedSettings();

  return (
    <div className={styles.container}>
      <h1>Initial render performance - contained triggers</h1>
      <SettingsPanel settings={settings} onChange={setSettings} />
      <PerformanceBenchmark>
        <TestComponent settings={settings} />
      </PerformanceBenchmark>
    </div>
  );
}

function TestComponent(props: { settings: Settings }) {
  const { renderMenu, renderTooltip, renderPopover, renderDialog, renderPreviewCard } =
    props.settings;
  return (
    <div className={styles.rows}>
      {rows.map((row) => (
        <div key={row.index} className={styles.row}>
          <span className={styles.label}>{row.label}</span>
          <span className={styles.actions}>
            {renderDialog && <StyledDialog rowData={row} />}
            {renderMenu && <StyledMenu rowData={row} />}
            {renderPopover && <StyledPopover rowData={row} />}
            {renderPreviewCard && <StyledPreviewCard rowData={row} />}
            {renderTooltip && <StyledTooltip rowData={row} />}
          </span>
        </div>
      ))}
    </div>
  );
}

function StyledMenu({ rowData }: RowProps) {
  return (
    <Menu.Root>
      <Menu.Trigger className={styles.button} data-id={rowData.index}>
        Menu
      </Menu.Trigger>
      <Menu.Popover>
        <Menu.MenuList>
          {menuItems.map((item) => (
            <Menu.Item
              key={item.index}
              onAction={() => console.log(`Clicked ${item.label} for ${rowData.label}`)}
              className={menuDemoStyles.Item}
            >
              {item.label} for {rowData.label}
            </Menu.Item>
          ))}
        </Menu.MenuList>
      </Menu.Popover>
    </Menu.Root>
  );
}

function StyledPopover({ rowData }: RowProps) {
  return (
    <Popover.Root>
      <Popover.Trigger className={styles.button} data-id={rowData.index}>
        Popover
      </Popover.Trigger>
      <Popover.Popup offset={8} className={popoverDemoStyles.Popup}>
        <Popover.Arrow className={popoverDemoStyles.Arrow} />
        {rowData && <div>Popover for {rowData.label}</div>}
      </Popover.Popup>
    </Popover.Root>
  );
}

function StyledTooltip({ rowData }: RowProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger className={styles.button} data-id={rowData.index}>
        Tooltip
      </Tooltip.Trigger>
      <Tooltip.Popup className={tooltipDemoStyles.Popup} offset={10}>
        <Tooltip.Arrow className={tooltipDemoStyles.Arrow} />
        Tooltip for {rowData.label}
      </Tooltip.Popup>
    </Tooltip.Root>
  );
}

function StyledDialog({ rowData }: RowProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className={styles.button} data-id={rowData.index}>
        Dialog
      </Dialog.Trigger>
      <Dialog.Backdrop className={dialogDemoStyles.Backdrop} />
      <Dialog.Popup className={dialogDemoStyles.Popup}>
        <Dialog.Title className={dialogDemoStyles.Title}>Dialog</Dialog.Title>
        <Dialog.Description className={dialogDemoStyles.Description}>
          Dialog content for {rowData.label}
        </Dialog.Description>
        <div className={dialogDemoStyles.Actions}>
          <Dialog.Close className={dialogDemoStyles.Button}>Close</Dialog.Close>
        </div>
      </Dialog.Popup>
    </Dialog.Root>
  );
}

function StyledPreviewCard({ rowData }: RowProps) {
  return (
    <PreviewCard.Root>
      <PreviewCard.Trigger
        className={styles.button}
        data-id={rowData.index}
      >
        Preview Card
      </PreviewCard.Trigger>
      <PreviewCard.Popup className={previewCardDemoStyles.Popup}>
        <PreviewCard.Content>
          <div className={previewCardDemoStyles.PopupContent} style={{ width: 'max-content' }}>
            <p className={previewCardDemoStyles.Summary}>Preview for {rowData.label}</p>
          </div>
        </PreviewCard.Content>
      </PreviewCard.Popup>
    </PreviewCard.Root>
  );
}
