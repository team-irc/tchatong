import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import styles from "../../../styles/ContactUs.module.css";
import { ChangeEvent, FC, useState } from "react";
import { Snackbar, TextField } from "@mui/material";
import MuiAlert from "@mui/material/Alert";

const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

const ContactUs: FC = () => {
  const [openSuccess, setOpenSuccess] = useState<string>("");
  const [openInfo, setOpenInfo] = useState<string>("");
  const [openError, setOpenError] = useState<string>("");

  const [emailError, setEmailError] = useState<string>("");

  const [issueType, setIssueType] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [body, setBody] = useState<string>("");

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
      setOpenInfo("본문을 채워주세요.");
      return;
    }
    if (emailError) {
      setOpenError("이메일 형식을 확인해주세요.");
      return;
    }
    createNewIssue().then((res) => {
      if (res?.message === "server error")
        setOpenError("잠시 후 다시 시도해주세요.");
      else {
        setIssueType("");
        setName("");
        setEmail("");
        setBody("");
        setOpenSuccess("문의를 보냈습니다.");
      }
    });
  };

  const emailOnChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setEmail(e.target.value);
    if (e.target.value !== "" && !emailRegex.test(e.target.value)) {
      setEmailError("이메일 형식에 맞춰서 작성해주세요.");
    } else setEmailError("");
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
          onChange={emailOnChange}
          error={!!emailError}
          helperText={emailError}
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
