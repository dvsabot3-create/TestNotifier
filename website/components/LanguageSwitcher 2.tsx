import { useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
  dir?: 'ltr' | 'rtl';
}

const languages: LanguageOption[] = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'cy', name: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', dir: 'rtl' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = async (languageCode: string) => {
    const language = languages.find(lang => lang.code === languageCode);

    if (language) {
      // Set document direction for RTL languages
      if (language.dir === 'rtl') {
        document.documentElement.setAttribute('dir', 'rtl');
      } else {
        document.documentElement.setAttribute('dir', 'ltr');
      }

      // Change language
      await i18n.changeLanguage(languageCode);

      // Update URL with new locale
      const { pathname, asPath, query } = router;
      await router.push({ pathname, query }, asPath, { locale: languageCode });

      setIsOpen(false);
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 border-gray-300 hover:border-[#1d70b8] hover:text-[#1d70b8]"
        >
          <Globe className="w-4 h-4" />
          <span className="flex items-center gap-1">
            <span>{currentLanguage.flag}</span>
            <span className="hidden sm:inline">{currentLanguage.name}</span>
          </span>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[150px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-100"
          >
            <span className="text-sm">{language.flag}</span>
            <span className="flex-1">{language.name}</span>
            {currentLanguage.code === language.code && (
              <span className="text-[#1d70b8] text-xs font-semibold">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;