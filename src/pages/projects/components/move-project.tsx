import { useMemo, useState } from "react";
import { Modal, type Option } from "@/components";
import { SelectStatus } from '@/components/select-status';
import { db } from "@/utils";
import { theme } from "@/theme";
import type { DbCategory, DbProject } from "../types";
import { useAppState, useChangeModal, useInvalidateCategories } from "../hooks";

type Props = {
  currentProjectId: number;
}

export function MoveProject(props: Props) {
  const { currentProjectId } = props;
  // TODO: see if we need useMemo???
  const categories = useMemo(() => db.query<DbCategory, []>('SELECT * FROM categories').all(), []);
  const project = useMemo(() => db.query<DbProject, [number]>('SELECT * FROM projects where id = ?').get(currentProjectId), [currentProjectId]);
  const otherCategories = categories.filter(cat => cat.id !== project?.category_id);
  const moveOptions = otherCategories.map(({ title, id }) => ({ label: title, value: id }))
  const [value, setValue] = useState<Option | null>(null);
  const { currentModal } = useAppState();
  const invalidateCategories = useInvalidateCategories();
  const changeModal = useChangeModal();

  const onSelect = (option: Option) => {
    if (option === null || !value || !project) return;
    db.run('UPDATE projects SET category_id = ? WHERE id = ?', [value.value, project.id]);
    invalidateCategories()
    changeModal(null);
  }

  const onChange = (option: Option) => setValue(option);

  return (
    <Modal>
      <box borderColor={theme.cyan} title="Move Project...">
        <text>
          Changing the category of <span fg={theme.green}>{project?.title}</span>?
        </text>

        <SelectStatus
          value={value}
          onSelect={onSelect}
          options={moveOptions}
          currentModal={currentModal}
          focused={currentModal === 'moveProject'}
          onChange={onChange as any /* TODO: fix this */}
        />
      </box>
    </Modal>
  );
}
