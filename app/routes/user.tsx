import * as React from 'react';
import { Container, Typography } from '@mui/material';
import { WorkCard } from '~/components/WorkCard';
import Navbar from '~/components/Navbar';
import 'tailwindcss/index.css';

import type { Topic } from '~/interface/topics';
import type { Route } from '../+types/root';

export const loader = ({ request, params }: Route.LoaderArgs) => {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('isLoggedIn=true') || false,
        name: request.headers.get('Cookie')?.split('; name=')[1].split(';')[0] || '',
        username: params.id,
    };
};

export default function Index({ loaderData = { isLoggedIn: false, name: '', username: '' } }) {
    const isLoggedIn = loaderData.isLoggedIn;
    const name = loaderData.name;
    const username = loaderData.username;
    const [pageComponent, setPageComponent] = React.useState<React.JSX.Element>(
        <Typography variant="h4">加载中...</Typography>,
    );
    if (!isLoggedIn) {
        return <div>请登录</div>;
    }
    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            const response = await fetch(`/api/accounts/check_username?username=${username}`);
            const responseData: { has_username: boolean } = await response.json();
            if (!responseData.has_username) {
                setPageComponent(<Typography variant="h4">用户名不存在</Typography>);
            } else {
                const response2 = await fetch(`/api/accounts/${username}/topics`);
                const responseData2: { topics: Topic[] } = await response2.json();
                console.log(responseData2.topics);
                setPageComponent(
                    <>
                        <Typography variant="h4">{username}</Typography>
                        <div className="grid grid-cols-4 gap-4 md:grid-cols-4">
                            {responseData2.topics.map(topic => (
                                <WorkCard key={topic.id} topic={topic} />
                            ))}
                        </div>
                    </>,
                );
            }
        };
        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);
    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} name={name} />
            <Container className="mt-2" sx={{ position: 'relative', top: '80px' }}>
                {pageComponent}
            </Container>
        </>
    );
}
