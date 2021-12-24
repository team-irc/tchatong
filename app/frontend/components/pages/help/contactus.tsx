import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import styles from "../../../styles/ContactUs.module.css";
import { FC, useState } from "react";
import { Snackbar, TextField } from "@material-ui/core";
import MuiAlert from "@mui/material/Alert";

const ContactUs: FC = () => {
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [openError, setOpenError] = useState<boolean>(false);

  const [issueType, setIssueType] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [body, setBody] = useState<string>("");

  const createNewIssue = async () => {
    const res = await fetch(`http://${location.hostname}:3000/issue`, {
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
      setOpenInfo(true);
      return;
    }
    createNewIssue().then((res) => {
      if (res?.message === "server error") setOpenError(true);
      else {
        setIssueType("");
        setName("");
        setEmail("");
        setBody("");
        setOpenSuccess(true);
      }
    });
  };

  return (
    <>
      <Box className={styles.Box}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">문의 종류</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={issueType}
            label="문의 종류"
            onChange={(e) => setIssueType(e.target.value)}
          >
            <MenuItem sx={{ width: "100%" }} value="➕ 스트리머 추가 문의">
              ➕ 스트리머 추가 문의
            </MenuItem>
            <MenuItem sx={{ width: "100%" }} value="🎸 기타 문의">
              🎸 기타 문의
            </MenuItem>
          </Select>
        </FormControl>
        <TextField
          variant="outlined"
          label="성함"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="이메일 주소"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          label="본문"
          multiline
          minRows={20}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <Button
          variant="contained"
          className={styles.Button}
          onClick={handleClick}
        >
          문의하기
        </Button>
      </Box>
      <Snackbar
        open={openSuccess}
        autoHideDuration={6000}
        onClose={() => setOpenSuccess(false)}
      >
        <MuiAlert
          onClose={() => setOpenSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          문의를 보냈습니다.
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={openInfo}
        autoHideDuration={6000}
        onClose={() => setOpenInfo(false)}
      >
        <MuiAlert
          onClose={() => setOpenInfo(false)}
          severity="info"
          sx={{ width: "100%" }}
        >
          공란을 모두 채워주세요.
        </MuiAlert>
      </Snackbar>
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={() => setOpenError(false)}
      >
        <MuiAlert
          onClose={() => setOpenError(false)}
          severity="error"
          sx={{ width: "100%" }}
        >
          죄송합니다. 나중에 다시 시도해 주세요.
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ContactUs;
