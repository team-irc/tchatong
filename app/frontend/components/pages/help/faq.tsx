import { FC, useState } from "react";

const Faq: FC = (): JSX.Element => {
  const [open, setOpen] = useState(true);

  const handleClick = () => {
    setOpen(!open);
  };

  return <></>;
};

export default Faq;
