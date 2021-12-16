import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FC, useState } from "react";

const ContactUs: FC = () => {
  const [issueType, setIssueType] = useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    setIssueType(event.target.value as string);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={issueType}
          label="Age"
          onChange={handleChange}
          sx={{
            padding: "0.8rem 1rem 0.5rem 1rem !important",
            "& .Mui-focused": { backgroundColor: "#8958d8 !important" },
          }}
        >
          <MenuItem sx={{ width: "100%" }} value={10}>
            Ten
          </MenuItem>
          <MenuItem sx={{ width: "100%" }} value={20}>
            Twenty
          </MenuItem>
          <MenuItem sx={{ width: "100%" }} value={30}>
            Thirty
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default ContactUs;
