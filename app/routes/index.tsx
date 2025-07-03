import * as React from 'react';
import Navbar from '~/components/Navbar';
import { Container } from '@mui/material';
import { WorkCard } from '~/components/WorkCard';
import 'tailwindcss/index.css';

import type { Topic } from '~/interface/topics';
import type { Route } from '../+types/root';

export const loader = ({ request }: Route.LoaderArgs) => {
    return {
        isLoggedIn: request.headers.get('Cookie')?.includes('isLoggedIn=true') || false,
        name: request.headers.get('Cookie')?.split('; name=')[1].split(';')[0] || '',
    };
};

export default function Index({ loaderData = { isLoggedIn: false, name: '' } }) {
    const isLoggedIn = loaderData.isLoggedIn;
    const name = loaderData.name;
    const [topics, setTopics] = React.useState<Topic[]>([]);
    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            const response = await fetch('/api/topics');
            const responseData = await response.json();
            console.log(responseData);
            setTopics(responseData);
        };
        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);
    return (
        <>
            <Navbar isLoggedIn={isLoggedIn} name={name} />
            <Container className="grid grid-cols-4 gap-4 md:grid-cols-4" sx={{ position: 'relative', top: '80px' }}>
                {topics.map(topic => (
                    <WorkCard key={topic.id} topic={topic} />
                ))}
            </Container>
        </>
    );
}
