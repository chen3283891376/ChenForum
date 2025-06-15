import * as React from "react";
import { TextField, Button, Container, Card, CardContent, CardActions, Box, Typography } from "@mui/material";
import { Link } from "react-router";
import AutoCloseAlert from '~/components/AutoCloseAlert';

export default function Login() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [alerts, setAlerts] = React.useState<React.JSX.Element[]>([]);

    const handleSubmit = async () => {
        const response = await fetch("/api/accounts/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password,
            }),
        });
        const responseData: { message: string } = await response.json();
        if (responseData.message === "登录成功!") {
            setAlerts([
                ...alerts,
                 <AutoCloseAlert
                     severity="success"
                     key={alerts.length}
                     children={responseData.message}
                 />,
            ]);
            setTimeout(() => {
                window.location.href = "/";
            }, 1000);
        } else {
            setAlerts([
                ...alerts,
                <AutoCloseAlert
                    severity="error"
                    key={alerts.length}
                    children={responseData.message}
                />,
            ]);
        }
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
                            value={username}
                            onChange={e => setUsername(e.target.value)}
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
                    </Box>
                </CardContent>
                
                <CardActions sx={{ p: 6, pt: 0, justifyContent: 'center' }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleSubmit}
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
                        登录
                    </Button>
                </CardActions>
                
                <Box sx={{ p: 2, pt: 0, textAlign: 'center', color: '#666' }}>
                    <Typography variant="body2">
                        没有账号? <Link to="/register" style={{ color: '#1976D2', textDecoration: 'none' }}>立即注册</Link>
                    </Typography>
                </Box>
            </Card>
        </Container>
    );
}