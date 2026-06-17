import ScaleApp from '@tale-ui/playground-scale';

export type ScaleDemoProps = {
  syncUrlHash?: boolean;
};

export default function ScaleDemo({ syncUrlHash = true }: ScaleDemoProps) {
  return <ScaleApp syncUrlHash={syncUrlHash} />;
}
