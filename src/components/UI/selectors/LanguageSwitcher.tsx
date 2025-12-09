import React, { useState } from "react";
import { Menu, MenuItem, Button } from "@mui/material";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import { useTranslation } from "react-i18next";

const LanguageSwitcher: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [language, setLanguage] = useState<"en" | "uk">("en");
  const { i18n } = useTranslation();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelect = (lang: "en" | "uk") => {
    setLanguage(lang);
    handleClose();
    i18n.changeLanguage(lang);
  };

  return (
    <div className="language-switcher">
      <LanguageOutlinedIcon sx={{ fontSize: 32, color: "#1840CE" }} />
      <Button
        onClick={handleClick}
        variant="contained"
        sx={{
          textTransform: "none",
          padding: "2px 8px 2px 8px",
          minWidth: "auto",
        }}
      >
        {language}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={() => handleSelect("en")}>(en) English</MenuItem>
        <MenuItem onClick={() => handleSelect("uk")}>(ua) Українська</MenuItem>
      </Menu>
    </div>
  );
};

export default LanguageSwitcher;
