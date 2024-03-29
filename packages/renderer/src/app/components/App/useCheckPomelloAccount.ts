import { selectSettings } from '@/app/appSlice';
import SerializableHttpError from '@/shared/helpers/SerializableHttpError';
import usePomelloApi from '@/shared/hooks/usePomelloApi';
import { usePomelloConfigSelector, usePomelloConfigUpdater } from '@/shared/hooks/usePomelloConfig';
import usePrevious from '@/shared/hooks/usePrevious';
import useTranslation from '@/shared/hooks/useTranslation';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

const useCheckPomelloAccount = () => {
  const { t } = useTranslation();
  const pomelloApi = usePomelloApi();

  const token = usePomelloConfigSelector(config => config.token);
  const previousToken = usePrevious(token);

  const [setPomelloConfig, unsetPomelloConfig] = usePomelloConfigUpdater();

  const settings = useSelector(selectSettings);

  const { refetch } = useQuery(
    'pomelloUser',
    async () => {
      if (!token) {
        return Promise.reject('NO_TOKEN');
      }

      return pomelloApi.fetchUser();
    },
    {
      cacheTime: Infinity,
      onError: async error => {
        if (error instanceof SerializableHttpError && error.response.status === 500) {
          new Notification(t('pomelloApiUnresponsiveTitle'));
          return;
        }

        if (
          error !== 'NO_TOKEN' &&
          error instanceof SerializableHttpError &&
          error.response.status !== 401
        ) {
          return;
        }

        unsetPomelloConfig('token');
        unsetPomelloConfig('user');

        if (settings.checkPomelloStatus) {
          const { response } = await window.app.showMessageBox({
            type: 'info',
            buttons: [
              t('pomelloAccountUnconnectedDialogConfirm'),
              t('pomelloAccountUnconnectedDialogCancel'),
              t('pomelloAccountUnconnectedDialogDisable'),
            ],
            message: t('pomelloAccountUnconnectedDialogMessage'),
            detail: t('pomelloAccountUnconnectedDialogDescription'),
            defaultId: 0,
            cancelId: 1,
          });

          if (response === 0) {
            return window.app.showAuthWindow({
              type: 'pomello',
              action: 'authorize',
            });
          }

          if (response === 2) {
            window.app.updateSetting('checkPomelloStatus', false);
          }
        }
      },
      onSuccess: user => {
        setPomelloConfig('user', user);
      },
      // Disable refetch on tests to avoid act warnings
      refetchInterval: import.meta.env.MODE === 'test' ? false : 60 * 1000 * 10,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      suspense: false,
      useErrorBoundary: false,
    }
  );

  useEffect(() => {
    if (token && !previousToken) {
      refetch();
    }
  }, [previousToken, refetch, token]);
};

export default useCheckPomelloAccount;
