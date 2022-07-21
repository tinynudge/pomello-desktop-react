import Select from '@/select/Select';
import services from '@/services';
import { TranslationsProvider } from '@/shared/context/TranslationsContext';
import getTranslations from '@/__bootstrap__/getTranslations';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const renderSelect = async () => {
  const container = document.getElementById('root');

  if (!container) {
    throw new Error('Unable to find container with id "root"');
  }

  const [settings, translations] = await Promise.all([window.app.getSettings(), getTranslations()]);

  createRoot(container).render(
    <StrictMode>
      <TranslationsProvider translations={translations}>
        <Select services={services} settings={settings} />
      </TranslationsProvider>
    </StrictMode>
  );
};

renderSelect();
