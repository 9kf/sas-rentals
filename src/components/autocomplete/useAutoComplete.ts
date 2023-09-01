import { useState } from "react";
import { IOption } from "../../utils/types";

interface IUseAutoComplete<T extends IOption> {
  options: T[];
  onSelectCallback?: (id: string) => void;
}

export function useAutoComplete<T extends IOption>({
  options,
  onSelectCallback,
}: IUseAutoComplete<T>) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [shownOptions, setShownOptions] = useState<T[]>([]);

  function toggle(open: boolean | undefined) {
    if (open === undefined) {
      setIsCollapsed(!isCollapsed);
      return;
    }

    setIsCollapsed(open);
  }

  function onSelect(optionId: string) {
    onSelectCallback?.(optionId);
    setIsCollapsed(true);
  }

  function searchText(text: string) {
    const newShownOptions = options.filter((option) =>
      option.name.toLocaleLowerCase().includes(text.toLocaleLowerCase())
    );
    setShownOptions(newShownOptions);
  }

  return {
    options,
    onSelect,
    toggle,
    isCollapsed,
    searchText,
    shownOptions,
  };
}
