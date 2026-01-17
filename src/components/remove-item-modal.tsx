import { useKeyboard } from "@opentui/react"
import { Modal } from "@/components";
import { theme } from "@/theme";

type Props = {
  close: () => void;
  name: string;
  submitRemove: () => void;
  type: 'project' | 'category' | 'task';
}

export function RemoveItemModal(props: Props) {
  const { name, type, close, submitRemove } = props;

  useKeyboard((key) => {
    if (key.name === 'y') submitRemove();
    if (key.name === 'n' || key.name === 'escape') close();
  });

  return (
    <Modal>
      <box borderColor={theme.cyan} title={`Remove ${type} ...`}>
        <text>
          Are you sure to remove <span fg={theme.red}>{name}</span>? y/n
        </text>
      </box>
    </Modal>
  );
}

