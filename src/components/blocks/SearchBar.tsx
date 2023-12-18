import { useState } from "preact/hooks";
import type { searchType } from "@utils/types";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (searchQuery: string, searchType: searchType) => void;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<searchType>("Posts");

  const handleInput = (e: any) => {
    setQuery(e.target.value);
  };

  const handleChange = (e: any) => {
    setType(e.target.value);
  };

  return (
    <div className={"join w-full"}>
      <div className="w-10/12">
        <input
          type="search"
          className={"input input-bordered join-item w-full"}
          value={query}
          onInput={handleInput}
        />
      </div>
      <select
        className="select select-bordered join-item"
        onChange={handleChange}
        value={type}
      >
        <option value="Posts" selected>
          Posts
        </option>
        <option value="Users">Users</option>
      </select>
      <div>
        <button
          className={"btn join-item btn-accent"}
          onClick={() => onSearch(query, type)}
        >
          Search
        </button>
      </div>
    </div>
  );
}
