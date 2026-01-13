import { useKeyboard } from "@opentui/react";
import { useState } from "react";
import { useAppDispatch } from "../providers";
import { theme } from "../theme/theme";

type Option = { label: string, value: string | number };

type Props = {
  options: Option[],
  onSelect: (o: Option | null) => void;
};

export default function Select(props: Props) {
  const { options, onSelect } = props;
  const [selected, setSelected] = useState<Option | null>(null);
  const dispatch = useAppDispatch();

  useKeyboard((key) => {
    if (key.name === 'return') {
      onSelect(selected);
      dispatch({ type: 'ADD_MODAL', payload: null });
    }

    if (key.name === 'j') {
      if (options[0] === undefined) return;
      if (selected === null) setSelected(options[0]);
      else {
        const currentIdx = options.findIndex(o => o.value === selected.value);
        const nextOption = options[currentIdx + 1];
        if (currentIdx !== -1 && nextOption !== undefined) {
          setSelected(nextOption);
        }
      }
    }

    if (key.name === 'k') {
      if (options[0] === undefined) return;
      if (selected === null) return;
      const currentIdx = options.findIndex(o => o.value === selected.value);
      const prevOption = options[currentIdx - 1];
      if (currentIdx !== -1 && prevOption !== undefined) {
        setSelected(prevOption);
      }
    }
  });

  return (
    <box>
      {options.map(({ label, value }) => {
        const isSelected = selected?.value === value;
        return (
        <text key={value} fg={isSelected ? theme.green : theme.gray}>
          {isSelected ? "▶ " : "• "}{label}
        </text>
      )
      })}
    </box>
  );
}
