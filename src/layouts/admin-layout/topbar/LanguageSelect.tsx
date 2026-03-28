import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';
import { useI18n, Locale } from 'i18n/I18nContext';
import { useState } from 'react';

interface Language {
  code: Locale;
  lang: string;
  flag: string;
}

const languages: Language[] = [
  {
    code: 'en',
    lang: 'English',
    flag: 'twemoji:flag-united-kingdom',
  },
  {
    code: 'zh',
    lang: '中文',
    flag: 'twemoji:flag-china',
  },
];

const LanguageSelect = () => {
  const { locale, setLocale } = useI18n();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const currentLang = languages.find((l) => l.code === locale) || languages[0];

  const handleFlagButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFlagMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageItemClick = (langItem: Language) => {
    setLocale(langItem.code);
    handleFlagMenuClose();
  };

  return (
    <>
      <IconButton onClick={handleFlagButtonClick} size="large">
        <IconifyIcon icon={currentLang.flag} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        id="language-menu"
        open={open}
        onClose={handleFlagMenuClose}
        onClick={handleFlagMenuClose}
        sx={{
          mt: 1.5,
          '& .MuiList-root': {
            width: 200,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {languages.map((langItem) => (
          <MenuItem
            key={langItem.code}
            sx={{ bgcolor: langItem.code === locale ? 'info.dark' : null }}
            onClick={() => handleLanguageItemClick(langItem)}
          >
            <ListItemIcon sx={{ mr: 2, fontSize: 'h3.fontSize' }}>
              <IconifyIcon icon={langItem.flag} />
            </ListItemIcon>
            <ListItemText>
              <Typography>{langItem.lang}</Typography>
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelect;
