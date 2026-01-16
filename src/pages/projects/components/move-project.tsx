import { useMemo, useState, type ComponentProps } from "react";
import { useKeyboard } from "@opentui/react"
import { Modal, type Option } from "@/components";
import { SelectStatus } from '@/components/select-status';
import { db } from "@/utils/db";
import { theme } from "@/theme";
import type { DbCategory, DbProject } from "../providers/categories/types";
import { useProjectUiDispatch, useProjectUiState } from "../providers/project-page/project-page";
import { useInvalidateCategories } from "../providers/categories";

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
  const { currentModal } = useProjectUiState();
  const dispatch = useProjectUiDispatch();
  const invalidateCategories = useInvalidateCategories();

  useKeyboard((key) => {
    if (currentModal !== 'moveCategory') return;

    if (key.name === 'escape') {
      dispatch({ type: 'CHANGE_MODAL', payload: null });
    }
  });

  const onSelect: ComponentProps<typeof SelectStatus>['onSelect'] = (option) => {
    if (option === null || !value || !project) return;
    db.run('UPDATE projects SET category_id = ? WHERE id = ?', [value.value, project.id]);
    invalidateCategories()
    dispatch({ type: 'CHANGE_MODAL', payload: null });
  }

  const onChange = (option: Option) => setValue(option);

  return (
    <Modal>
      <box borderColor={theme.cyan} title="Move Task...">
        <text>
          Changing the category of <span fg={theme.green}>{project?.title}</span>?
        </text>

        <SelectStatus
          focused
          value={value}
          onSelect={onSelect}
          options={moveOptions}
          currentModal={currentModal}
          onChange={onChange as any /* TODO: fix this */}
        />
      </box>
    </Modal>
  );
}
