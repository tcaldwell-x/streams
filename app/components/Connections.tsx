import { useState, useEffect }from 'react';
import ConnectionList from './ConnectionList';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { Connection } from '../shared/types';
import { useStreams } from '@/hooks/streams';

export default function Connections(props: Connection) {
    const { type, startStream, stopStream, ...other } = props;
    const [newStreamStarted, setNewStreamStarted] = useState(false);

    const { refetchStreams } = useStreams();

    useEffect(() => {
        refetchStreams();
    }, [newStreamStarted])

    return (
        <div>
            <div className="pb-3 text-2xl">
            Connections
            </div>
            <Divider flexItem />
            <Stack>
            <ConnectionList />
            <Stack className="py-4 items-center mb-1 mt-2" direction="row">
                <Button className="text-white bg-zinc-800 hover:text-black hover:bg-white w-full" size="medium" variant="contained" onClick={startStream}>
                    Start new connection
                </Button>
            </Stack>
            </Stack>
            <Divider className="py-1" flexItem />
        </div>
    );
}