import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import styles from "../../../styles/ContactUs.module.css";
import { ChangeEvent, FC, useReducer, useState } from "react";
import { Snackbar, TextField } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

interface UserInput {
  issueType: string;
  name: string;
  email: string;
  body: string;
}

const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const userInputReducer = (
  state: UserInput,
  action: {
    type: "issueType" | "name" | "email" | "body" | "init";
    newValue: string;
  }
) => {
  switch (action.type) {
    case "issueType":
      return { ...state, issueType: action.newValue };
    case "name":
      return { ...state, name: action.newValue };
    case "email":
      return { ...state, email: action.newValue };
    case "body":
      return { ...state, body: action.newValue };
    case "init":
      return { issueType: "", name: "", email: "", body: "" };
    default:
      throw new Error("contact us user input reducer type error");
  }
};

const ContactUs: FC = () => {
  const [openSuccess, setOpenSuccess] = useState<string>("");
  const [openInfo, setOpenInfo] = useState<string>("");
  const [openError, setOpenError] = useState<string>("");

  const [emailError, setEmailError] = useState<string>("");

  const [{ issueType, name, email, body }, userInputDispatch] = useReducer(
    userInputReducer,
    {
      issueType: "",
      name: "",
      email: "",
      body: "",
    }
  );

  const createNewIssue = async () => {
    const res = await fetch(`${window.origin}/api/issue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        issueType,
        name,
        email,
        body,
      }),
    });
    const data = await res.json();
    if (data?.name === "HttpError") return Error("server error");
    return data;
  };

  const handleClick = (): void => {
    if (issueType === "" || name === "" || email === "" || body === "") {
      setOpenInfo("????????? ???????????????.");
      return;
    }
    if (emailError) {
      setOpenError("????????? ????????? ??????????????????.");
      return;
    }
    createNewIssue().then((res) => {
      if (res?.message === "server error")
        setOpenError("?????? ??? ?????? ??????????????????.");
      else {
        userInputDispatch({ type: "init", newValue: "" });
        setOpenSuccess("????????? ???????????????.");
      }
    });
  };

  const emailOnChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    userInputDispatch({ type: "email", newValue: e.target.value });
    if (e.target.value !== "" && !emailRegex.test(e.target.value)) {
      setEmailError("????????? ????????? ????????? ??????????????????.");
    } else setEmailError("");
  };

  return (
    <>
      <FormControl fullWidth className={styles.Box}>
        <FormControl>
          <InputLabel id="demo-simple-select-label">?????? ??????</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={issueType}
            label="?????? ??????"
            required
            onChange={(e) =>
              userInputDispatch({ type: "issueType", newValue: e.target.value })
            }
          >
            <MenuItem sx={{ width: "100%" }} value="??? ???????????? ?????? ??????">
              ??? ???????????? ?????? ??????
            </MenuItem>
            <MenuItem sx={{ width: "100%" }} value="???? ?????? ??????">
              ???? ?????? ??????
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          label="??????"
          value={name}
          required
          onChange={(e) =>
            userInputDispatch({ type: "name", newValue: e.target.value })
          }
        />
        <TextField
          variant="outlined"
          label="????????? ??????"
          value={email}
          required
          onChange={emailOnChange}
          error={!!emailError}
          helperText={emailError}
        />
        <TextField
          variant="outlined"
          label="??????"
          required
          multiline
          minRows={20}
          value={body}
          onChange={(e) =>
            userInputDispatch({ type: "body", newValue: e.target.value })
          }
        />
        <Button variant="contained" onClick={handleClick}>
          ????????????
        </Button>
      </FormControl>
      <Snackbar
        open={!!openSuccess}
        autoHideDuration={6000}
        onClose={() => setOpenSuccess("")}
      >
        <MuiAlert
          onClose={() => setOpenSuccess("")}
          severity="success"
          sx={{ width: "100%" }}
        >
          {openSuccess}
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={!!openInfo}
        autoHideDuration={6000}
        onClose={() => setOpenInfo("")}
      >
        <MuiAlert
          onClose={() => setOpenInfo("")}
          severity="info"
          sx={{ width: "100%" }}
        >
          {openInfo}
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={!!openError}
        autoHideDuration={6000}
        onClose={() => setOpenError("")}
      >
        <MuiAlert
          onClose={() => setOpenError("")}
          severity="error"
          sx={{ width: "100%" }}
        >
          {openError}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ContactUs;
