import * as React from 'react';
import { Card, CardContent, CardHeader, Typography, Button } from '@mui/material';
import { getButtonGradient } from '~/theme';

import type { Topic } from '~/interface/topics';
import type { PaletteMode } from '@mui/material';

export function WorkCard({ topic, mode }: { topic: Topic, mode: PaletteMode }) {
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
        <Card key={topic.id} className="max-width-sm">
            <CardHeader title={topic.name} subheader={topic.description} />
            <CardContent>
                <Typography
                    className="overflow-hidden text-ellipsis whitespace-nowrap"
                    variant="body2"
                    color="text.primary"
                >
                    {topic.content}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                    作者：<a href={`/user/${topic.author}`}>{topic.author}</a> | 点赞：{likes}
                </Typography>
                <br />
                <Button sx={{ color: 'white', background: getButtonGradient({ mode }) }} href={`/topic/${topic.id}`}>
                    详情
                </Button>
            </CardContent>
        </Card>
    );
}
