import { useState } from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Stack } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useStreams } from '@/hooks/streams';

export default function ConnectionList() {

    const [checked, setChecked] = useState(new Map());

    const { streams } = useStreams();

    const handleToggle = (value: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
        newChecked.push(value);
        } else {
        newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    function renderRow(props: ListChildComponentProps) {
        const { index, style } = props;
      
        return (
          <ListItem
          style={style} key={index} component="div"
          secondaryAction={
            // <Tooltip title="Disconnect" placement="left">
                <IconButton edge="end" aria-label="disconnect" disabled>
                <RemoveCircleOutlineIcon />
                </IconButton>
            // </Tooltip>
          }
          disablePadding
        >
          <ListItemButton role={undefined} onClick={handleToggle(index)} dense>
            <ListItemIcon>
              <Checkbox
                edge="start"
                checked={checked.get(streams[index].id)}
                tabIndex={-1}
                disableRipple
                inputProps={{ 'aria-labelledby': index }}
              />
            </ListItemIcon>
            <ListItemText className="overflow-scroll" id={index} primary={`${streams[index].streamId}`} />
          </ListItemButton>
        </ListItem>
        );
      }

  return (
    <>
    <Stack className="justify-between" direction="row">
        <Tooltip title="Select all" placement="right">
            <IconButton className="ml-1" edge="end">
                <CheckBoxIcon/>
            </IconButton>
        </Tooltip>
        {/* <Tooltip title="Disconnect selected" placement="left"> */}
            <IconButton className="mr-1" edge="end" aria-label="disconnect-selected" disabled>
                <RemoveCircleIcon />
            </IconButton>
        {/* </Tooltip> */}
    </ Stack>
    <Box
      sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
    >
      <FixedSizeList
        height={400}
        width={360}
        itemSize={46}
        itemCount={streams ? streams.length : 0}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </Box>
    </>
  );
}
