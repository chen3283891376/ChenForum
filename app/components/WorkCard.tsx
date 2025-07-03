import * as React from 'react';
import { Card, CardContent, CardHeader, Typography, Button } from '@mui/material';

import type { Topic } from '~/interface/topics';

export function WorkCard({ topic }: { topic: Topic }) {
    const [likes, setLikes] = React.useState(0);
    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            const response = await fetch(`/api/topics/${topic.id}/likes`);
            const responseData: { likes: number } = await response.json();
            setLikes(responseData.likes | 0);
        };
        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);
    return (
        <Card key={topic.id}>
            <CardHeader title={topic.name} subheader={topic.description} />
            <CardContent>
                <Typography
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    variant="body2"
                    color="text.primary"
                >
                    {topic.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    作者：<a href={`/user/${topic.author}`}>{topic.author}</a> | 点赞：{likes}
                </Typography>
                <br />
                <Button variant="contained" color="primary" href={`/topic/${topic.id}`}>
                    详情
                </Button>
            </CardContent>
        </Card>
    );
}
