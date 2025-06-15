import * as React from 'react';
import { Typography, Container, Icon } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Navbar from '~/components/Navbar';
import { WorkCard } from '~/components/WorkCard';
import 'tailwindcss/index.css'

import type { Route } from './+types/search';
import type { Topic } from '~/interface/topics';

export async function loader({ request }: Route.LoaderArgs) {
    return {
        keyword: new URL(request.url).searchParams.get('keyword') || null,
        isLoggedIn: request.headers.get('Cookie')?.includes('isLoggedIn=true') || false,
        name: request.headers.get('Cookie')?.split('; name=')[1].split(';')[0] || '',
    };
}
export default function Search({ loaderData = { keyword: null, isLoggedIn: false, name: '' } }) {
    if (!loaderData.keyword) {
        return <Typography variant="h1">请输入关键字</Typography>;
    }
    const keyword = loaderData.keyword;
    const [searchResult, setSearchResult] = React.useState<Topic[]>([]);
    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            const response = await fetch(`/api/topics/search?keyword=${keyword}`);
            const responseData = await response.json();
            setSearchResult(responseData);
        };
        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, []);
    return (
        <>
            <Navbar isLoggedIn={loaderData.isLoggedIn} name={loaderData.name} />
            <Container sx={{ position: 'relative', top: '80px' }}>
                <Typography variant="h5">
                    <Icon sx={{ mr: 1 }} fontSize="medium">
                        <SearchIcon />
                    </Icon>
                    搜索结果
                </Typography>
                <div className="grid grid-cols-4 gap-4 md:grid-cols-4">
                    {searchResult.map(topic => (
                        <WorkCard key={topic.id} topic={topic} />
                    ))}
                </div>
            </Container>
        </>
    );
}
