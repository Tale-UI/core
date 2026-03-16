import { Drawer } from '@tale-ui/react/drawer';
import styles from './cross-axis-scroll.module.css';

type OverflowAxis = 'x' | 'y';

interface DrawerCase {
  id: string;
  label: string;
  overflowAxis: OverflowAxis;
}

const drawerCases: DrawerCase[] = [
  { id: 'scroll-x', label: 'Drawer - X overflow', overflowAxis: 'x' },
  { id: 'scroll-y', label: 'Drawer - Y overflow', overflowAxis: 'y' },
];

export default function DrawerCrossAxisScrollExperiment() {
  return (
    <div className={styles.Root}>
      <h1 className={styles.Title}>Drawer cross-axis scroll matrix</h1>
      <p className={styles.Description}>
        Open each case and test scrolling on the overflow axis.
      </p>

      <div className={styles.Grid}>
        {drawerCases.map((testCase) => (
          <DrawerCaseCard key={testCase.id} testCase={testCase} />
        ))}
      </div>
    </div>
  );
}

function DrawerCaseCard(props: { testCase: DrawerCase }) {
  const { testCase } = props;

  return (
    <section className={styles.Card}>
      <h2 className={styles.CardTitle}>{testCase.label}</h2>
      <p className={styles.CardDescription}>
        Scroll overflow axis: <strong>{testCase.overflowAxis.toUpperCase()}</strong>.
      </p>

      <Drawer.Root>
        <Drawer.Trigger>Open case</Drawer.Trigger>
        <Drawer.Backdrop />
        <Drawer.Popup>
          <Drawer.Title>{testCase.label}</Drawer.Title>
          <Drawer.Description>
            Try scrolling in the panel.
          </Drawer.Description>
          <OverflowRegion axis={testCase.overflowAxis} />
          <div>
            <Drawer.Close>Close</Drawer.Close>
          </div>
        </Drawer.Popup>
      </Drawer.Root>
    </section>
  );
}

function OverflowRegion(props: { axis: OverflowAxis }) {
  const { axis } = props;

  if (axis === 'y') {
    return (
      <div className={styles.ScrollRegionY}>
        {Array.from({ length: 16 }, (_, index) => (
          <div key={`row-${index}`} className={styles.Row}>
            Vertical row {index + 1}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.ScrollRegionX}>
      <div className={styles.Track}>
        {Array.from({ length: 12 }, (_, index) => (
          <div key={`chip-${index}`} className={styles.Chip}>
            Horizontal item {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
