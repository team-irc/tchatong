import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HelpIcon from "@mui/icons-material/Help";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { FC, useState } from "react";
import styles from "../../../styles/Faq.module.css";

const QuestionAndAnswer: FC<{ title: string; content: string }> = ({
  title,
  content,
}): JSX.Element => {
  const [answerOpen, setAnswerOpen] = useState<boolean>(false);
  const questionOnClickHandler = (): void => {
    setAnswerOpen((answerOpen) => !answerOpen);
  };

  return (
    <>
      <ListItem className={styles.ListItem}>
        <ListItemButton
          sx={{ padding: "1rem !important" }}
          onClick={questionOnClickHandler}
        >
          <ListItemIcon>
            <HelpIcon className={styles.Icon} />
          </ListItemIcon>
          <ListItemText primary={title} className={styles.Title} />
          <ListItemIcon>
            {answerOpen ? (
              <KeyboardArrowUpIcon className={styles.Icon} />
            ) : (
              <KeyboardArrowDownIcon className={styles.Icon} />
            )}
          </ListItemIcon>
        </ListItemButton>
      </ListItem>
      {answerOpen && <Box className={styles.Answer}>{content}</Box>}
    </>
  );
};

const Faq: FC = (): JSX.Element => {
  return (
    <List>
      <QuestionAndAnswer
        title="제가 좋아하는 스트리머가 없어요"
        content="문의로 스트리머 아이디를 남겨주시면 검토 후에 리스트에 추가하도록 하겠습니다."
      />
    </List>
  );
};

export default Faq;
