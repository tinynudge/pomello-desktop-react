import AuthView from '@/auth/ui/AuthView';
import getPomelloServiceConfig from '@/shared/helpers/getPomelloServiceConfig';
import useTranslation from '@/shared/hooks/useTranslation';
import { FC } from 'react';
import pomelloLogo from './assets/pomello.png';

interface PomelloAuthViewProps {
  action: 'authorize' | 'register';
}

const PomelloAuthView: FC<PomelloAuthViewProps> = ({ action }) => {
  const { t } = useTranslation();

  const handleTokenSubmit = async (token: string) => {
    const config = await getPomelloServiceConfig();

    config.set('token', token);
  };

  return (
    <AuthView>
      <AuthView.Instructions
        authUrl={`${import.meta.env.VITE_APP_URL}/api/${action}/`}
        heading={t('authPomelloHeading')}
        logo={pomelloLogo}
      />
      <AuthView.Form onSubmit={handleTokenSubmit} />
    </AuthView>
  );
};

export default PomelloAuthView;
