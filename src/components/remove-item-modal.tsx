import { useKeyboard } from "@opentui/react"
import { Modal } from "@/components";
import { theme } from "@/theme";

type Props = {
  entityName: string;
  close: () => void;
  submitRemove: () => void;
}

export function RemoveItemModal(props: Props) {
  const { entityName, close, submitRemove } = props;

  useKeyboard((key) => {
    if (key.name === 'y') submitRemove();
    if (key.name === 'n' || key.name === 'escape') close();
  });

  return (
    <Modal>
      <box borderColor={theme.cyan} title="Remove Task...">
        <text>
          Are you sure to remove <span fg={theme.red}>{entityName}</span>? y/n
        </text>
      </box>
    </Modal>
  );
}

