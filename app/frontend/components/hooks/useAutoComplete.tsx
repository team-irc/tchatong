import { TextField } from "@material-ui/core";
import router from "next/router";
import {
  useState,
  useEffect,
  SyntheticEvent,
  ReactNode,
  KeyboardEventHandler,
} from "react";
import { Streamer } from "../../interfaces/streamer";
import { AutocompleteRenderInputParams } from "@mui/material/Autocomplete/Autocomplete";

interface AutocompleteProps {
  disablePortal: boolean;
  freeSolo: boolean;
  options: Streamer[];
  inputValue: string;
  onInputChange: (_: SyntheticEvent, value: string) => any;
  getOptionLabel: (data: Streamer) => string;
  onKeyPress: (e: any) => void;
  renderInput: (params: AutocompleteRenderInputParams) => ReactNode;
}

const useAutoComplete = (
  initAutoCompleteData: Streamer[] = [],
  initTextToSearch: string = ""
): [AutocompleteProps, () => void] => {
  const [autoCompleteData, setAutoCompleteData] =
    useState<Streamer[]>(initAutoCompleteData);
  const [textToSearch, setTextToSearch] = useState<string>(initTextToSearch);

  const fetchAutoCompleteData = async (): Promise<Streamer[]> => {
    const res: Response = await fetch(`${window.origin}/api/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: "{ Streamer_getAll { nick, image_url } }",
      }),
    });
    const data: Streamer[] = (await res.json()).data.Streamer_getAll;
    return data;
  };

  const searchButtonOnClick = () => {
    router.push(`/${textToSearch}`);
  };

  const searchBarKeyDown = (e: any) => {
    if (e.code === "Enter" && e.target.value) {
      router.push(`/${textToSearch}`);
    }
  };

  useEffect(() => {
    fetchAutoCompleteData().then((data) => setAutoCompleteData(data));
  }, []);

  return [
    {
      disablePortal: true,
      freeSolo: true,
      options: autoCompleteData,
      inputValue: textToSearch,
      onInputChange: (_: SyntheticEvent, value: string) =>
        setTextToSearch(value ? value : ""),
      getOptionLabel: (data: Streamer) => data.nick ?? data,
      onKeyPress: searchBarKeyDown,
      renderInput: (params: AutocompleteRenderInputParams) => (
        <TextField {...params} label={"검색하기"} variant={"filled"} />
      ),
    },
    searchButtonOnClick,
  ];
};

export default useAutoComplete;
