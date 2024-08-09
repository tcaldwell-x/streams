import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { Stack } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { useRulesManagement } from '@/hooks/rules';

export default function RuleList() {

  const [checked, setChecked] = useState(new Map());

  const { rules, refetchRules, deleteRule, isDeletingRule, deleteRuleSuccess, deleteRuleError, deleteRuleData } = useRulesManagement();

  useEffect(() => {
    refetchRules();
}, [deleteRuleSuccess, deleteRuleError, deleteRuleData])

  const selectAll = () => {
    let isSelectAll = true;
    for (const rule of rules) {
      if (!checked.get(rule.id)) {
        isSelectAll = false;
        break;
      }
    }
    if (isSelectAll) {
      // Unselect all
      setChecked(new Map());
    } else {
      // Select all
      const newChecked = new Map()
      for (const rule of rules) {
        newChecked.set(rule.id, true)
      }
      setChecked(newChecked);
    }
  };

  const handleSelectRule = (index: number) => () => {
    checked.set(rules[index].id, !checked.get(rules[index].id));
    setChecked(new Map(checked));
  };

  const handleDeleteRule = (index: number) => () => {
    checked.delete(rules[index].id)
    setChecked(new Map(checked))
    deleteRule([rules[index].id])
  };

  const handleDeleteSelectedRules = () => {
    const selectedRuleIds = Array.from(checked.keys());
    deleteRule(selectedRuleIds.filter((key) => checked.get(key)))
    for (const id of selectedRuleIds) {
      checked.delete(id)
    }
    setChecked(new Map(checked))
  };

  function renderRow(props: ListChildComponentProps) {
    const { index, style } = props;
  
    return (
      <ListItem
      style={style} key={index} component="div"
      secondaryAction={
        <Tooltip title="Remove" placement="left">
          <IconButton edge="end" aria-label="delete-rule" onClick={handleDeleteRule(index)}>
            <RemoveCircleOutlineIcon />
          </IconButton>
        </Tooltip>
      }
      disablePadding
    >
      <ListItemButton role={undefined} onClick={handleSelectRule(index)} dense>
        <ListItemIcon>
          <Checkbox
            edge="start"
            checked={checked.get(rules[index].id)}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': index }}
          />
        </ListItemIcon>
        <ListItemText className="overflow-scroll" id={index} primary={`${rules[index].value}`} />
      </ListItemButton>
    </ListItem>
    );
  }

  return (
    <>
    <Stack className="justify-between" direction="row">
        <Tooltip title="Select all" placement="right">
            <IconButton className="ml-1" edge="end" onClick={selectAll}>
                <CheckBoxIcon/>
            </IconButton>
        </Tooltip>
        <Tooltip title="Remove selected" placement="left">
            <IconButton className="mr-1" edge="end" onClick={handleDeleteSelectedRules} >
                <RemoveCircleIcon />
            </IconButton>
        </Tooltip>
    </ Stack>
    <Box sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}>
      <FixedSizeList
        height={400}
        width={360}
        itemSize={46}
        itemCount={rules ? rules.length : 0}
        overscanCount={5}
      >
        {renderRow}
      </FixedSizeList>
    </Box>
    </>
  );
}