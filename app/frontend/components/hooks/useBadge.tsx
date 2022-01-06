import { useEffect, useState } from "react";

const online = {
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px #fffffb`,
    width: 35,
    height: 35,
    borderRadius: "50%",
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
};

const offline = {
  "& .MuiBadge-badge": {
    backgroundColor: "#808080",
    color: "#808080",
    boxShadow: `0 0 0 2px #fffffb`,
    width: 35,
    height: 35,
    borderRadius: "50%",
  },
};

const useBadge = (onAir: boolean) => {
  const [badgeProps, setBadgeProps] = useState({
    overlap: "circular",
    anchorOrigin: { vertical: "bottom", horizontal: "right" },
    variant: "dot",
    sx: offline,
  });

  useEffect(() => {
    setBadgeProps((prev) => {
      return {
        ...prev,
        sx: onAir ? online : offline,
      };
    });
  }, [onAir]);

  return badgeProps;
};

export default useBadge;
