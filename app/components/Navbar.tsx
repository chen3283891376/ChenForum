import * as React from'react';
import { AppBar, Toolbar, Typography, TextField, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navbar = () => {
    const [keyword, setKeyword] = React.useState<string>('');
    return (
        <AppBar position="fixed" color="info" sx={{ marginBottom: '10rem' }}>
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
                    ChenWall
                </Typography>
                <Typography sx={{ flexGrow: 1 }}></Typography>
                <TextField
                    label="搜索"
                    variant="outlined"
                    component="form"
                    value={keyword}
                    onChange={(event) => setKeyword(event.target.value)}
                    onSubmit={(event) => {
                        event.preventDefault();
                        location.href = `/search?keyword=${keyword}`;
                    }}
                    sx={{ width: '20rem' }}
                />
                <IconButton
                    size='medium'
                >
                    <AccountCircle fontSize='large' />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;