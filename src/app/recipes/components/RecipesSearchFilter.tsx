"use client";

import s from "../Recipes.module.scss";
import MultiDropdown, { type Option } from "@/shared/components/MultiDropdown";

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  categoryOptions: Option[];
  selectedCategoryIds: number[];
  onCategoryChange: (ids: number[]) => void;
  onSearchClick: () => void;
};

export default function RecipesSearchFilter({
  searchValue,
  onSearchChange,
  categoryOptions,
  selectedCategoryIds,
  onCategoryChange,
  onSearchClick,
}: Props) {
  return (
    <div className={s.recipes__searchFilterBar}>
      <div className={s.recipes__searchInputGroup}>
        <input
          type="text"
          placeholder="Enter dishes"
          className={s.recipes__searchInput}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className={s.recipes__filterGroup}>
        <MultiDropdown
          className={s.recipes__multiDropdown}
          options={categoryOptions}
          value={categoryOptions.filter((opt) =>
            selectedCategoryIds.includes(Number(opt.key))
          )}
          onChange={(val) => {
            const ids = val
              .map((v) => Number(v.key))
              .filter((id) => !Number.isNaN(id));
            onCategoryChange(ids);
          }}
          getTitle={(val) => {
            if (val.length === 0) return "All categories";
            if (val.length <= 3) return val.map((v) => v.value).join(", ");
            return `${val.length} categories`;
          }}
        />
        <button
          className={s.recipes__searchBtn}
          type="button"
          onClick={onSearchClick}
        >
          Search
        </button>
      </div>
    </div>
  );
}
