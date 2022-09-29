import ButtonsOverlay from '@/app/ui/ButtonsOverlay';
import useService from '@/shared/hooks/useService';
import useTranslation from '@/shared/hooks/useTranslation';
import { AxiosError } from 'axios';
import { FC, useEffect, useRef } from 'react';
import { selectToken, useTrelloConfigSelector, useTrelloConfigUpdater } from '../useTrelloConfig';
import sanitizeTrelloError from './sanitizeTrelloError';

interface TrelloAuthErrorProps {
  error: AxiosError;
  onTokenSet(): void;
}

const TrelloAuthError: FC<TrelloAuthErrorProps> = ({ error, onTokenSet }) => {
  const { t } = useTranslation();
  const { displayName, id } = useService();

  const [, unsetConfig] = useTrelloConfigUpdater();
  const token = useTrelloConfigSelector(selectToken);

  const didUnsetToken = useRef(false);

  useEffect(() => {
    if (!token && !didUnsetToken.current) {
      didUnsetToken.current = true;
    } else if (token && didUnsetToken.current) {
      onTokenSet();
    }
  }, [onTokenSet, token]);

  const handleSignInClick = () => {
    openAuthWindow();
  };

  const handleDetailsClick = async () => {
    const { response } = await window.app.showMessageBox({
      message: t('authErrorDialogMessage', { service: displayName }),
      cancelId: 2,
      defaultId: 0,
      buttons: [t('errorDialogSignIn'), t('errorDialogCopyError'), t('errorDialogCancel')],
      type: 'error',
    });

    if (response === 0) {
      openAuthWindow();
    } else if (response === 1) {
      window.app.writeClipboardText(JSON.stringify(sanitizeTrelloError(error), null, 2));
    }
  };

  const openAuthWindow = () => {
    unsetConfig('token');

    window.app.showAuthWindow(id);
  };

  return (
    <ButtonsOverlay
      buttons={[
        { id: 'signIn', content: t('authErrorSignIn'), onClick: handleSignInClick },
        { id: 'details', content: t('errorDetails'), onClick: handleDetailsClick },
      ]}
    >
      {t('authErrorMessage')}
    </ButtonsOverlay>
  );
};

export default TrelloAuthError;
