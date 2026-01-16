import { useKeyboard } from '@opentui/react';
import { Modal } from '@/components';
import { theme } from '@/theme';
import { useState } from 'react';

type Props = {
  close: () => void;
  initialValue?: string;
  onSubmit: (value: string) => void;
  entityName: 'category' | 'project';
}

export function UpsertItemModal(props: Props) {
  const { onSubmit, entityName, close, initialValue } = props;
  const [value, setValue] = useState(initialValue ?? '');

  useKeyboard((key) => {
    if (key.name === 'escape') close();
  });

  return (
    <Modal>
      <box
        border
        width='100%'
        height={'auto'}
        borderColor={theme.cyan}
        title={`${initialValue ? 'Edit' : 'Enter'} your ${initialValue ? '' : 'new'} ${entityName} name...`}
      >
        <input
          focused
          height={1}
          value={value}
          onInput={setValue}
          onSubmit={onSubmit}
          backgroundColor={theme.bg}
          placeholder={`${entityName} name`}
        />
      </box>
    </Modal>
  )
}
