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

  const handleClick = (): void => {
    if (issueType === "" || name === "" || email === "" || body === "") {
      setOpenInfo(true);
      return;
    }
    setOpenSuccess(true);
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
            <MenuItem sx={{ width: "100%" }} value="addStreamer">
              ➕ 스트리머 추가 문의
            </MenuItem>
            <MenuItem sx={{ width: "100%" }} value="etc">
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
          rows={20}
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
          This is a success message!
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
          This is a info message!
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
          This is a err message!
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ContactUs;
