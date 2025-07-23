import * as React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    InputBase,
    IconButton,
    Menu,
    MenuItem,
    Divider,
    Button,
    Box,
} from '@mui/material';
import {
    AccountCircle,
    Search as SearchIcon,
    Brightness4 as DarkModeIcon,
    Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import PublishDialog from './PublishDialog';
import { setCookie } from '~/utils';
import { getButtonGradient, getTextGradient } from '~/theme';

import type { PaletteMode } from '@mui/material';

const Navbar = ({
    isLoggedIn,
    name,
    mode,
    setMode,
    KEYWORD
}: {
    isLoggedIn: boolean;
    name: string;
    mode: PaletteMode;
    setMode: (mode: PaletteMode) => void;
    KEYWORD?: string;
}) => {
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [keyword, setKeyword] = React.useState<string>(KEYWORD || '');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
    };

    const toogleTheme = () => {
        setMode(mode === 'light' ? 'dark' : 'light');
    };

    return (
        <AppBar position="fixed" color="info" sx={{ marginBottom: '10rem' }}>
            <PublishDialog open={openDialog} setOpen={setOpenDialog} name={name} mode={mode} />
            <Toolbar>
                <Typography
                    variant="h5"
                    component="a"
                    href="/"
                    noWrap
                    sx={{
                        ...getTextGradient({ mode }),
                        textDecoration: 'none',
                        pl: 2,
                    }}
                >
                    ChenForum
                </Typography>
                <Typography sx={{ flexGrow: 1 }}></Typography>
                <Box
                    sx={{
                        display: { xs: 'none', md: 'flex' },
                        position: 'relative',
                        width: '33%',
                        maxWidth: '500px',
                    }}
                >
                    <SearchIcon
                        sx={{
                            position: 'absolute',
                            left: 12,
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'text.secondary',
                        }}
                    />
                    <InputBase
                        value={keyword}
                        onChange={event => setKeyword(event.target.value)}
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                location.href = `/search?keyword=${keyword}`;
                            }
                        }}
                        sx={{
                            width: '100%',
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider',
                            borderRadius: '50px',
                            py: 1,
                            px: 4,
                            pl: '40px',
                            '&:focus-within': {
                                borderColor: 'primary.main',
                                boxShadow: '0 0 0 2px rgba(63, 81, 181, 0.2)',
                            },
                        }}
                    />
                </Box>

                <IconButton size="medium" onClick={toogleTheme}>
                    {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
                {isLoggedIn && (
                    <>
                        <IconButton
                            id="basic-button"
                            size="medium"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={event => setAnchorEl(event.currentTarget)}
                        >
                            <AccountCircle fontSize="large" />
                        </IconButton>
                        <Menu
                            id="basic-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleClose}
                            slotProps={{
                                list: {
                                    'aria-labelledby': 'basic-button',
                                },
                            }}
                        >
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    location.href = `/user/${name}`;
                                }}
                            >
                                个人中心
                            </MenuItem>
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    setOpenDialog(true);
                                }}
                            >
                                发布
                            </MenuItem>
                            <Divider />
                            <MenuItem
                                onClick={() => {
                                    handleClose();
                                    setCookie('isLoggedIn', 'false', 2222, '/');
                                    setCookie('name', '', 2222, '/');
                                    location.reload();
                                }}
                            >
                                登出
                            </MenuItem>
                        </Menu>
                    </>
                )}
                {!isLoggedIn && (
                    <Button sx={{ background: getButtonGradient({ mode }) }} href="/login" color="inherit">
                        登录
                    </Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
