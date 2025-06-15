import * as React from 'react';
import { TextField, Button, Container, Box, Typography, Card, CardContent, CardActions } from '@mui/material';
import AutoCloseAlert from '~/components/AutoCloseAlert';
import { sha256 } from '~/utils';
import { Link } from 'react-router';

export default function Register() {
    const [name, setName] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);

    const handleRegister = async () => {
        if (name === '' || password === '' || confirmPassword === '') {
            setAlerts([
                ...alerts,
                <AutoCloseAlert severity="error" dismissible={false}>
                    请填写所有字段
                </AutoCloseAlert>,
            ]);
            return;
        }
        if (password !== confirmPassword) {
            setAlerts([
                ...alerts,
                <AutoCloseAlert severity="error" dismissible={false}>
                    密码不匹配
                </AutoCloseAlert>,
            ]);
            return;
        }
        const pass = await sha256(password);
        const response = await fetch('/api/accounts/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: name,
                password: pass,
            }),
        });
        const responseData: { message: string } = await response.json();
        if (responseData.message !== '注册成功!') {
            setAlerts([
                ...alerts,
                <AutoCloseAlert severity="error" dismissible={false}>
                    {responseData.message}
                </AutoCloseAlert>,
            ]);
            return;
        }
        setAlerts([
            ...alerts,
            <AutoCloseAlert severity="success" closeTimeout={2000} dismissible={false}>
                注册成功，即将跳转登录页面
            </AutoCloseAlert>,
        ]);
        setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
    };

    return (
        <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Card sx={{ width: '100%', boxShadow: 3, borderRadius: 4 }}>
                <CardContent>
                    <Box sx={{ mb: 6, textAlign: 'center' }}>
                        <Typography variant="h5" component="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
                            创建账户
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                            请填写以下信息完成注册
                        </Typography>
                    </Box>
                    
                    <div className="alerts">
                        {alerts}
                    </div>
                    
                    <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <TextField
                            label="用户名"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            variant="outlined"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />
                        
                        <TextField
                            label="密码"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            variant="outlined"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />
                        
                        <TextField
                            label="确认密码"
                            type="password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            variant="outlined"
                            required
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Box>
                </CardContent>
                
                <CardActions sx={{ p: 6, pt: 0, justifyContent: 'center' }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleRegister}
                        fullWidth
                        size="large"
                        sx={{
                            borderRadius: 2,
                            py: 2,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            textTransform: 'none',
                        }}
                    >
                        注册
                    </Button>
                </CardActions>
                
                <Box sx={{ p: 2, pt: 0, textAlign: 'center', color: '#666' }}>
                    <Typography variant="body2">
                        已有账户？ <Link to="/login" style={{ color: '#1976D2', textDecoration: 'none' }}>立即登录</Link>
                    </Typography>
                </Box>
            </Card>
        </Container>
    );
}