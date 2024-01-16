import { useState } from "preact/hooks";
import SearchBar from "../blocks/SearchBar";
import type { searchType } from "@utils/types";
import AdminSearchFeed from "./AdminSearchFeed";
import { Shield } from "lucide-preact";

export default function AdminSearchPage() {
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
      <div className={"w-full h-fit flex flex-col items-center"}>
        <div className={"flex flex-row gap-2 items-center"}>
          <Shield />
          <h2 className={"text-2xl font-semibold"}>Manage {type}</h2>
        </div>
      </div>
      <div className={"w-full flex flex-row justify-center pt-4"}>
        <div className={"w-10/12"}>
          <SearchBar
            onSearch={async (searchQuery, searchType) => {
              handleSearch(searchQuery, searchType);
            }}
          />
        </div>
      </div>
      <div className="mt-6">
        <AdminSearchFeed key={key} searchType={type} searchQuery={query} />
        <div class="h-32"></div>
      </div>
    </div>
  );
}
