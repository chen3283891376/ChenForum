import * as React from'react';
import { TextField, Card, CardContent, CardActions, IconButton, Stack, Typography, Divider } from '@mui/material';
import { Send, Favorite, FavoriteBorder } from '@mui/icons-material';

import type { Comment } from '~/interface/comments';

export default function CommentBox({ topic_id, author, isLoggedIn }: { topic_id: string, author: string, isLoggedIn: boolean }) {
    const [comment, setComment] = React.useState('');
    const [comments, setComments] = React.useState<Comment[]>([]);
    const [isLiked, setIsLiked] = React.useState(false);

    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            const response = await fetch(`/api/topics/${topic_id}/comments`);
            const data = await response.json();
            setComments(data);

            const response2 = await fetch(`/api/topics/${topic_id}/has_liked?username=${author}`);
            const data2: { has_liked: boolean } = await response2.json();
            setIsLiked(data2.has_liked);
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
                        disabled={!isLoggedIn}
                        multiline
                        fullWidth
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                    />
                </CardContent>
                <CardActions>
                    <IconButton color='primary' disabled={!comment || comment.trim().length === 0 || !isLoggedIn } aria-label="send" onClick={handleSubmit}>
                        <Send />
                    </IconButton>
                    <IconButton aria-label="like" color="primary" onClick={() => {
                        fetch(`/api/topics/${topic_id}/likes`, {
                            method: (isLiked ? 'DELETE' : 'POST'),
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ username: author }),
                        });
                        setIsLiked(!isLiked);
                    }} disabled={!isLoggedIn}>
                        {isLiked? <Favorite /> : <FavoriteBorder />}
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
                                    <Typography component={"a"} href={`/user/${comment.author}`} variant="h6" color="text.secondary">
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