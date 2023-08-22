import {
  Anchor,
  Group,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';

import type { Icon } from 'tabler-icons-react';
import { Button, ButtonVariant } from '../Button';
import { Fab } from '../Fab';
import useStyles from './Actions.styles';
import { Fragment } from 'react';

export interface Action {
  label: string;
  icon: Icon;
  href?: string;
  side: 'left' | 'right';
  target?: '_self' | '_blank' | '_parent' | '_top';
  hide?: boolean;
  action?: (value?: any) => void;
  variant?: ButtonVariant;
}

export interface ActionsProps {
  actions: Action[];
}

export function Actions(props: ActionsProps) {
  const { classes } = useStyles();

  const rightActions = props.actions.filter(
    (action: Action) => !action.hide && action.side === 'right',
  );
  const leftActions = props.actions.filter(
    (action: Action) => !action.hide && action.side === 'left',
  );
  const actions = [...leftActions, ...rightActions];

  return (
    <>
      <Group className={classes.wrapper}>
        <Group>
          { leftActions.map((action: Action, index: number) =>
            <Tooltip key={index} label={action.label} position="bottom">
              <div>
                {!action.action && action.href && 
                  <Anchor target={action.target} href={action.href}>
                    <UnstyledButton className={classes.action}>
                      <action.icon size={28} />
                    </UnstyledButton>
                  </Anchor>
                }
                {action?.action && 
                  <UnstyledButton className={classes.action} onClick={() => action.action()}>
                    <action.icon size={28} />
                  </UnstyledButton>
                }
              </div>
            </Tooltip>
          )}
        </Group>
        <Group>
          { rightActions.map((action, index) =>
            <Fragment key={index}>
              {!action.action && action.href &&  
                <Anchor target={action.target} href={action.href}>
                  <Button variant={action.variant}>
                    {action.label}
                  </Button>
                </Anchor>
              }
              {action?.action && 
                <Button variant={action.variant} onClick={() => action.action()}>
                  {action.label}
                </Button>
              }
            </Fragment>
          )}
        </Group>
      </Group>
      { actions.length > 0 && 
        <Fab>
          { actions.map((action, index) =>
            <Fragment key={index}>
              {!action.action && action.href && 
                <Anchor target={action.target} href={action.href}>
                  <Fab.Button label={action.label}>
                    <action.icon size={32} />
                  </Fab.Button>
                </Anchor>
              }
              {action?.action && 
                <Fab.Button label={action.label} onClick={() => action.action()}>
                  <action.icon size={32} />
                </Fab.Button>
              }
            </Fragment>
          )}
        </Fab>
      }
    </>
  );
}