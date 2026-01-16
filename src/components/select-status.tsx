import { useKeyboard } from "@opentui/react";
import { theme } from "../theme";

export type Option = { label: string, value: string | number };

type Props = {
  focused: boolean;
  options: Option[],
  onSelect: (o: Option) => void;
  currentModal: unknown;
  value: Option | null;
  onChange: (option: Option) => void;
};

export function SelectStatus(props: Props) {
  const { value, onChange, options, onSelect, focused/* , currentModal */ } = props;

  useKeyboard((key) => {
    if (focused === false) return;

    if (key.name === 'return' && value) {
      onSelect(value);
    }

    if (key.name === 'j') {
      if (options[0] === undefined) return;
      if (value === null) onChange(options[0]);
      else {
        const currentIdx = options.findIndex(o => o.value === value.value);
        const nextOption = options[currentIdx + 1];
        if (currentIdx !== -1 && nextOption !== undefined) {
          onChange(nextOption);
        }
      }
    }

    if (key.name === 'k') {
      if (options[0] === undefined) return;
      if (value === null) return;
      const currentIdx = options.findIndex(o => o.value === value.value);
      const prevOption = options[currentIdx - 1];
      if (currentIdx !== -1 && prevOption !== undefined) {
        onChange(prevOption);
      }
    }
  });

  return (
    <box>
      {options.map((option) => {
        // TODO: think of something for this value.value
        const isSelected = value?.value === option.value;
        return (
        <text key={option.value} fg={isSelected ? theme.green : theme.gray}>
          {isSelected ? "▶ " : "• "}{option.label}
        </text>
      )
      })}
    </box>
  );
}
