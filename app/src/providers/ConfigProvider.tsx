import React, { createContext, useContext, useMemo, useState } from 'react';

export type ConfigContextValue = [ConfigType, (config: ConfigType) => void];

export const ConfigContext = createContext<ConfigContextValue | undefined>(
  undefined,
);

export function useConfig(): ConfigContextValue {
  const context = useContext(ConfigContext);

  if (context === undefined) {
    throw new Error('useConfig must be used inside ConfigProvider.');
  }

  return context;
}

export type ConfigType = {
  baseURL: string;
};

interface ConfigProviderProps {
  config: ConfigType;
  children?: React.ReactNode;
}

export function ConfigProvider(props: ConfigProviderProps) {
  const { Provider } = ConfigContext;
  const { config: initialConfig, ...restProps } = props;
  const [config, setConfig] = useState(initialConfig);

  const context = useMemo(
    () => [config, setConfig] as ConfigContextValue,
    [config, setConfig],
  );

  return <Provider {...restProps} value={context} />;
}
