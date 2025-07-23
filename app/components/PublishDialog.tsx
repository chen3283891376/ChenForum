import * as React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, InputAdornment } from '@mui/material';
import { getButtonGradient } from '~/theme';

import type { PaletteMode } from '@mui/material';

export default function PublishDialog({
    open,
    setOpen,
    name,
    mode
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    name: string;
    mode: PaletteMode;
}) {
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [content, setContent] = React.useState('');
    const handleClose = () => {
        setOpen(false);
    };
    const handlePublish = async () => {
        await fetch('/api/topics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                content: content,
                author: name,
            }),
        });
        handleClose();
    };
    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>发布文章</DialogTitle>
            <DialogContent>
                <TextField
                    label="标题"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end"></InputAdornment>,
                    }}
                />
                <TextField
                    label="摘要"
                    variant="outlined"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    fullWidth
                    margin="dense"
                    InputProps={{
                        endAdornment: <InputAdornment position="end"></InputAdornment>,
                    }}
                />
                <TextField
                    label="正文"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    multiline
                    rows={10}
                    InputProps={{
                        endAdornment: <InputAdornment position="end"></InputAdornment>,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button sx={{ background: getButtonGradient({ mode }), color: 'white' }} onClick={handleClose}>取消</Button>
                <Button sx={{ background: getButtonGradient({ mode }), color: 'white' }} onClick={handlePublish}>发布</Button>
            </DialogActions>
        </Dialog>
    );
}
