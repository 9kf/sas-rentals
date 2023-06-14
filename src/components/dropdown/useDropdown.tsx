import { useEffect, useState } from "react";
import { IOption } from "../../utils/types";

interface IUseDropdown<T extends IOption> {
  options: T[];
  onSelectCallback?: (id: string) => void;
  defaultSelectedValue?: string;
}

export function useDropdown<T extends IOption>({
  options,
  onSelectCallback,
  defaultSelectedValue,
}: IUseDropdown<T>) {
  const defaultSelectedOption = options[0].id;

  const [isCollapsed, setIsCollapsed] = useState(true);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
    defaultSelectedValue || defaultSelectedOption
  );

  useEffect(() => {
    onSelectCallback?.(defaultSelectedOption);
  }, []);

  function toggle(open: boolean | undefined) {
    if (open === undefined) {
      setIsCollapsed(!isCollapsed);
      return;
    }

    setIsCollapsed(open);
  }

  function onSelect(optionId: string) {
    setSelectedOptionId(optionId);
    setIsCollapsed(true);
    onSelectCallback?.(optionId);
  }

  function getSelectedOption() {
    return options.find((option) => option.id === selectedOptionId);
  }

  return {
    options,
    getSelectedOption,
    onSelect,
    toggle,
    isCollapsed,
  };
}
