import { TextField } from "@mui/material";
import router from "next/router";
import { ReactNode, SyntheticEvent, useEffect, useState } from "react";
import { Streamer } from "../../interfaces/streamer";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete/Autocomplete";

interface AutocompleteProps {
  disablePortal: boolean;
  freeSolo: boolean;
  options: Streamer[];
  inputValue: string;
  onInputChange: (_: SyntheticEvent, value: string) => any;
  getOptionLabel: (data: string | Streamer) => string;
  onKeyPress: (e: any) => void;
  renderInput: (params: AutocompleteRenderInputParams) => ReactNode;
}

const useAutoComplete = (
  initAutoCompleteData: Streamer[] = [],
  initTextToSearch: string = "",
  size: "small" | "medium"
): [AutocompleteProps, () => void] => {
  const [autoCompleteData, setAutoCompleteData] =
    useState<Streamer[]>(initAutoCompleteData);
  const [textToSearch, setTextToSearch] = useState<string>(initTextToSearch);

  const fetchAutoCompleteData = async (): Promise<Streamer[]> => {
    const res: Response = await fetch(`${window.origin}/api/streamer`);
    return (await res.json()).streamerList;
  };

  const searchButtonOnClick = () => {
    const searchResult = autoCompleteData.filter((streamer) => streamer.nick === textToSearch)
    if (!searchResult[0]) router.push("/not-found");
    else router.push(`/${searchResult[0].streamerId}`);
  };

  const searchBarKeyDown = (e: any) => {
    if (e.code === "Enter" && e.target.value) {
      const searchResult = autoCompleteData.filter((streamer) => streamer.nick === textToSearch)
      if (!searchResult[0]) router.push("/not-found");
      else router.push(`/${searchResult[0].streamerId}`);
    }
  };

  useEffect(() => {
    fetchAutoCompleteData().then((data) => setAutoCompleteData(data));
  }, []);

  return [
    {
      disablePortal: true,
      freeSolo: true,
      options: autoCompleteData.sort(function(x, y) {
          // 방송중인 스트리머 먼저
          return (x.onAir === y.onAir)? 0 : x.onAir? -1 : 1;
        }),
      inputValue: textToSearch,
      onInputChange: (_: SyntheticEvent, value: string) =>
        setTextToSearch(value ? value : ""),
      getOptionLabel: (data: string | Streamer) => {
        if (typeof(data) === "string") {
          return data
        }
        return data.nick;
      },
      onKeyPress: searchBarKeyDown,
      renderInput: (params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label={"검색하기"}
          variant={"filled"}
          size={size}
        />
      ),
    },
    searchButtonOnClick,
  ];
};

export default useAutoComplete;
