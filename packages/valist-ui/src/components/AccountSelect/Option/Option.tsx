import {
  Group,
  UnstyledButton,
} from '@mantine/core';

import { useContext } from 'react';
import * as Icon from 'tabler-icons-react';
import { Item } from '../../Item';
import { AccountSelectContext } from '../AccountSelect';

export interface OptionProps {
  name: string;
  value: string;
  image?: string;
  label?: string;
}

export function Option(props: OptionProps) {
  const { value, setValue } = useContext(AccountSelectContext);

  return (
    <UnstyledButton onClick={() => setValue(props.value)}>
      <Group position="apart">
        <Item {...props} />
        {value === props.value && 
          <Icon.Check color="#669F2A" /> 
        }
      </Group>
    </UnstyledButton>
  );
}