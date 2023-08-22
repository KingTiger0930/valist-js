import { 
  AppShell as MantineAppShell,
  useMantineTheme,
} from '@mantine/core';

import { useMediaQuery } from '@mantine/hooks';
import React from 'react';

export interface AppShellProps {
  children?: React.ReactNode;
  footer?: React.ReactElement;
  navbar?: React.ReactElement;
  header?: React.ReactElement;
  padding?: number;
  hideNavbar?: boolean;
}

export function AppShell(props: AppShellProps) {
  const theme = useMantineTheme();
  const showFooter = useMediaQuery(`(max-width: ${theme.breakpoints.sm}px)`, false);

  return (
    <MantineAppShell
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      padding={props.padding}
      footer={showFooter ? props.footer : undefined}
      navbar={props.hideNavbar ? undefined : props.navbar }
      header={props.header}
      fixed
    >
      { props.children }
    </MantineAppShell>
  );
}

AppShell.defaultProps = {
  padding: 40,
};