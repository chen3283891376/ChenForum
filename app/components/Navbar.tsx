import * as React from 'react';
import { AppBar, Toolbar, Typography, TextField, IconButton, Menu, MenuItem, Divider, Button } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import PublishDialog from './PublishDialog';
import { setCookie } from '~/utils';

const Navbar = ({ isLoggedIn, name }: { isLoggedIn: boolean; name: string }) => {
    const [openDialog, setOpenDialog] = React.useState<boolean>(false);
    const [keyword, setKeyword] = React.useState<string>('');
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="fixed" color="info" sx={{ marginBottom: '10rem' }}>
            <PublishDialog open={openDialog} setOpen={setOpenDialog} name={name} />
            <Toolbar>
                <Typography
                    variant="h6"
                    component="a"
                    href="/"
                    noWrap
                    sx={{
                        mr: 2,
                        display: { xs: 'none', md: 'flex' },
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        letterSpacing: '.3rem',
                        color: 'inherit',
                        textDecoration: 'none',
                    }}
                >
                    ChenForum
                </Typography>
                <Typography sx={{ flexGrow: 1 }}></Typography>
                <TextField
                    label="搜索"
                    variant="outlined"
                    component="form"
                    value={keyword}
                    onChange={event => setKeyword(event.target.value)}
                    onSubmit={event => {
                        event.preventDefault();
                        location.href = `/search?keyword=${keyword}`;
                    }}
                    sx={{ width: '20rem' }}
                />
                {isLoggedIn && (
                    <>
                        <IconButton 
                            id='basic-button'
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
                            <MenuItem onClick={() => {
                                handleClose();
                                location.href = `/user/${name}`;
                            }}>个人中心</MenuItem>
                            <MenuItem onClick={() => {
                                handleClose();
                                setOpenDialog(true);
                            }}>发布</MenuItem>
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
                    <Button href='/login' color="inherit">登录</Button>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
