import { useEffect, useState, ChangeEvent } from 'react';
import RuleList from './RuleList';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useRulesManagement } from '@/hooks/rules';
import { v4 } from "uuid";

export default function Rules() {

    const [value, setValue] = useState('');

    const { refetchRules, addRule, isAddingRule, addRuleSuccess, addRuleError, addRuleData } = useRulesManagement();

    useEffect(() => {
        refetchRules();
    }, [addRuleSuccess, addRuleError, addRuleData])

    const handleValueChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
      };

      const handleSubmit = () => {
        if (value) {
            const tag = v4();
            addRule(value, tag);
            setValue('');
        }
    };

    return (
        <div>
            <div className="pb-3 text-2xl">
                Rules
            </div>
            <Divider flexItem />
            <Stack>
                <RuleList />
                <Stack className="py-4 items-center" direction="row" spacing={2}>
                    <TextField
                        size="small"
                        className="w-full"
                        value={value}
                        onChange={handleValueChange}
                        label="Add rule"
                        variant="outlined"
                    />
                    <Tooltip title="Add rule" placement="bottom">
                        <IconButton
                            color="primary"
                            onClick={handleSubmit}
                            disabled={isAddingRule}
                        >
                            <AddCircleIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>
                {addRuleError && <p style={{ color: 'red' }}>Error: {addRuleError.message}</p>}
            </Stack>
            <Divider className="py-1" flexItem />
        </div>
    );
}