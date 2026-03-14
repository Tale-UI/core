'use client';
import { useIsoLayoutEffect } from '@tale-ui/utils/useIsoLayoutEffect';
import { useTaleUiId } from './useTaleUiId';

export function useRegisteredLabelId(
  idProp: string | undefined,
  setLabelId: (id: string | undefined) => void,
): string | undefined {
  const id = useTaleUiId(idProp);

  useIsoLayoutEffect(() => {
    setLabelId(id);

    return () => {
      setLabelId(undefined);
    };
  }, [id, setLabelId]);

  return id;
}
