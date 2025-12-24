import { appWithTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

interface TranslationProviderProps {
  children: React.ReactNode;
}

function TranslationProvider({ children }: TranslationProviderProps) {
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    // Set document language and direction
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale || 'en';

      // Set text direction for RTL languages
      const rtlLanguages = ['ur'];
      const dir = rtlLanguages.includes(locale || '') ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('dir', dir);

      // Update page title based on locale
      const titles = {
        en: 'TestNotifier - Find Cancelled Driving Tests',
        cy: 'TestNotifier - Dod o hyd i Prawf Gyrru wedi\'i Ganslo',
        pl: 'TestNotifier - Znajdź Odwołane Egzaminy na Prawo Jazdy',
        ur: 'ٹیسٹ نوٹیفائر - منسوخ شدہ ڈرائیونگ ٹیسٹ تلاش کریں'
      };

      document.title = titles[locale as keyof typeof titles] || titles.en;
    }
  }, [locale]);

  return <>{children}</>;
}

// Wrap with next-i18next HOC
export const AppWithTranslation = appWithTranslation(TranslationProvider);