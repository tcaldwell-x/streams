import { useState, useEffect } from 'react';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import TabPanel from './TabPanel';
import { useStreams } from '@/hooks/streams';

export default function OutputLogs(props: {data: any}) {

    const { data, ...other } = props;

    const [value, setValue] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const truncateString = (str: string, maxLength: number) => {
        if (str.length > maxLength) {
            return str.slice(0, maxLength - 3) + '...';
        }
        return str;
    }

    return (
        <div className="min-w-[496px] max-w-[496px]">
            <div className="pb-3 text-2xl">
                Output Logs
            </div>
            <Divider flexItem />
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="tabs" variant="scrollable" scrollButtons={false}>
                {
                    (!data || Object.keys(data).length === 0) && <Tab label={'Logs'} />
                }
                {
                    data && (Object.keys(data) as Array<string>).map((key) => {return <Tab label={truncateString(key, 15)} />})
                }
            </Tabs>
            </Box>
            {
                (!data || Object.keys(data).length === 0) && <TabPanel value={value} index={0}>
                    <Box>
                        <Paper className="p-3 text-xs overflow-auto min-h-[450px] max-h-[450px]" />
                    </Box>
                    </TabPanel>
            }
            {
                data && (Object.keys(data) as Array<string>).map((key, i) => {
                    return (<TabPanel value={value} index={i}>
                        <Box>
                            <Paper className="p-3 text-xs overflow-auto min-h-[450px] max-h-[450px]">
                                {
                                data[key] && 
                                data[key].map((log) => {return (<div className="mb-3">{log}</div>)})
                                }
                            </Paper>
                        </Box>
                        </TabPanel>)
                })
            }
            <div className="p-3"></div>
            <Divider className="py-1" flexItem />
        </div>
    );
}