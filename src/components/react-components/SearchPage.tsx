import { useState } from "preact/hooks";
import SearchBar from "../blocks/SearchBar";
import type { searchType } from "@utils/types";
import SearchFeed from "./SearchFeed";

export default function SearchPage({ currentUser }: { currentUser: string }) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<searchType>("Posts");
  const [key, setKey] = useState(1);

  const handleSearch = async (query: string, type: searchType) => {
    setQuery(query);
    setType(type);
    setKey(Math.random());
  };
  return (
    <div>
      <div className={"w-full flex flex-row justify-center pt-4"}>
        <div className={"w-10/12"}>
          <SearchBar
            onSearch={async (searchQuery, searchType) => {
              handleSearch(searchQuery, searchType);
              // alert(searchQuery);
            }}
          />
        </div>
      </div>
      <div className="mt-6">
        <SearchFeed
          key={key}
          searchType={type}
          searchQuery={query}
          currentUser={currentUser}
        />
        <div class="h-32"></div>
      </div>
    </div>
  );
}
