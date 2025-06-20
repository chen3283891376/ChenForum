import * as React from'react';
import { TextField, Card, CardContent, CardActions, IconButton, Stack, Typography, Button, Divider } from '@mui/material';
import { Send } from '@mui/icons-material';

import type { Comment } from '~/interface/comments';

export default function CommentBox({ topic_id, author }: { topic_id: string, author: string }) {
    const [comment, setComment] = React.useState('');
    const [comments, setComments] = React.useState<Comment[]>([]);

    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            const response = await fetch(`/api/topics/${topic_id}/comments`);
            const data = await response.json();
            setComments(data);
        };
        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetch(`/api/topics/${topic_id}/comments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content: comment, author: author }),
        });
        setComment('');
        setComments([{ content: comment, author: author, topic_id: Number(topic_id) }, ...comments]);
    };
    return (
        <>
            <Card sx={{ padding: '16px', margin: '16px 0' }}>
                <CardContent>
                    <TextField
                        id="outlined-basic"
                        label="评论"
                        variant="outlined"
                        multiline
                        fullWidth
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                    />
                </CardContent>
                <CardActions>
                    <IconButton aria-label="send" onClick={handleSubmit}>
                        <Send />
                    </IconButton>
                </CardActions>
            </Card>
            <Divider />
            <div>
                {comments.map((comment) => (
                    <>
                        <Card key={comment.topic_id}>
                            <CardContent>
                                <Stack direction="row" spacing={2}>
                                    <Typography variant="h6" color="text.secondary">
                                        {comment.author}
                                    </Typography>
                                    <Typography variant="h6" color="text.primary">
                                        {comment.content}
                                    </Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                        <Divider sx={{ margin: '16px 0' }} />
                    </>
                ))}
            </div>
        </>
    );
}