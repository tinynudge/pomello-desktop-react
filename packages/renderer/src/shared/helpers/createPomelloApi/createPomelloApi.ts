import { PomelloApi, PomelloServiceConfig, ServiceConfig } from '@pomello-desktop/domain';
import ky from 'ky';
import { SerializableHttpError } from '../SerializableHttpError';
import { bindContext } from '../bindContext';
import { fetchUser } from './fetchUser';
import { logEvent } from './logEvent';

export type PomelloApiContext = {
  client: typeof ky;
};

export const createPomelloApi = (config: ServiceConfig<PomelloServiceConfig>): PomelloApi => {
  let { token: encryptedToken } = config.get();
  let token: string | null = null;

  if (encryptedToken) {
    token = window.app.decryptValue(encryptedToken);
  }

  config.onChange(updatedConfig => {
    if (updatedConfig.token === encryptedToken) {
      return;
    }

    encryptedToken = updatedConfig.token;
    token = encryptedToken ? window.app.decryptValue(encryptedToken) : null;
  });

  const client = ky.create({
    hooks: {
      beforeError: [
        async error => {
          const message = await error.response.text();
          error.message = message;

          return new SerializableHttpError({ error, message });
        },
      ],
      beforeRequest: [
        request => {
          if (token) {
            request.headers.set('Authorization', `Bearer ${token}`);
          }
        },
      ],
    },
    prefixUrl: `${import.meta.env.VITE_APP_URL}/api`,
    retry: 0,
  });

  const hasToken = () => !!token;

  return bindContext(
    {
      fetchUser,
      hasToken,
      logEvent,
    },
    { client }
  );
};
