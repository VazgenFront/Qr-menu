import React from "react";
import "./SearchInput.css";
import search from "./search.png";
import { useLazyQuery } from "@apollo/client";
import { SEARCH_ITEM } from "../../queries/queries";

const SearchInput = ({
  searchValue,
  setSearchValue,
  accountId,
  setSearchResult,
}) => {
  const onSearchWordChange = (e) => {
    setSearchResult([]);
    setSearchValue(e.target.value);
  };

  const [getString] = useLazyQuery(SEARCH_ITEM);

  const getStringData = async () => {
    searchValue &&
      (await getString({
        variables: {
          accountId,
          namePart: searchValue,
        },
      }).then((res) => setSearchResult(() => [...res.data.searchMenuItem])));
  };

  return (
    <div className="SearchInput__wrapper">
      <div className="SearchInput">
        <input
          type="text"
          value={searchValue}
          className="search__input"
          onChange={onSearchWordChange}
        />

        <img src={search} alt="img" onClick={getStringData} />
      </div>
    </div>
  );
};

export default SearchInput;
