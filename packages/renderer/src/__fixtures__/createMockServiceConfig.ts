import { ServiceConfig, ServiceConfigChangeCallback, StoreContents } from '@domain';

const createMockServiceConfig = <TConfig = StoreContents>(
  _serviceId: string,
  initialConfig: TConfig
): ServiceConfig<TConfig> => {
  let config = JSON.parse(JSON.stringify(initialConfig));

  const listeners = new Set<ServiceConfigChangeCallback<TConfig>>();

  const get = () => config;

  const onChange = (callback: ServiceConfigChangeCallback<TConfig>) => {
    listeners.add(callback);

    return () => {
      listeners.delete(callback);
    };
  };

  const set = <TKey extends keyof TConfig>(key: TKey, value: TConfig[TKey]) => {
    config = { ...config, [key]: value };

    emitChangeEvent();
  };

  const unregister = () => {
    listeners.clear();
  };

  const unset = (key: keyof TConfig) => {
    config = { ...config };
    delete config[key];

    emitChangeEvent();
  };

  const emitChangeEvent = () => {
    listeners.forEach(callback => callback(config));
  };

  return {
    get,
    onChange,
    set,
    unregister,
    unset,
  };
};

export default createMockServiceConfig;
