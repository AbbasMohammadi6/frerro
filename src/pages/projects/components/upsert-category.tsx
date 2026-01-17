import { Modal } from '@/components';
import { theme } from '@/theme';
import { useState } from 'react';

type Props = {
  initialValue?: string;
  onSubmit: (value: string) => void;
}

export function UpsertCategoryModal(props: Props) {
  const { onSubmit, initialValue } = props;
  const [value, setValue] = useState(initialValue ?? '');
  const title = initialValue ? 'Edit your category name...' : 'Enter your new category name...';

  return (
    <Modal>
      <box border width='100%' title={title} height={'auto'} borderColor={theme.cyan} >
        <input
          focused
          height={1}
          value={value}
          onInput={setValue}
          onSubmit={onSubmit}
          backgroundColor={theme.bg}
          placeholder='Category name'
        />
      </box>
    </Modal>
  )
}
