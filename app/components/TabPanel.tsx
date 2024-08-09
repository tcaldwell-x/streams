import * as React from 'react';
import Box from '@mui/material/Box';

interface TabPanelProps {
    padding?: number;
    children?: React.ReactNode;
    index: number;
    value: number;
}
  
export default function TabPanel(props: TabPanelProps) {
    const { children, value, index, padding, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box className={padding ? `p-${padding}` : `p-0`}>{children}</Box>}
      </div>
    );
}