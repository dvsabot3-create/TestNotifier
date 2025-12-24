import { useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';

// Custom translation utilities for British localization
export const useBritishTranslation = () => {
  const { t, i18n } = useTranslation();

  // British-specific formatting
  const formatDate = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date | string): string => {
    const d = new Date(date);
    return d.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount);
  };

  const formatPostcode = (postcode: string): string => {
    // Format UK postcode properly
    const cleaned = postcode.replace(/\s/g, '').toUpperCase();
    if (cleaned.length <= 4) return cleaned;
    return `${cleaned.slice(0, -3)} ${cleaned.slice(-3)}`;
  };

  const getDirectionClass = (): string => {
    const rtlLanguages = ['ur'];
    return rtlLanguages.includes(i18n.language) ? 'rtl' : 'ltr';
  };

  const getTextAlignClass = (): string => {
    const rtlLanguages = ['ur'];
    return rtlLanguages.includes(i18n.language) ? 'text-right' : 'text-left';
  };

  return {
    t,
    i18n,
    formatDate,
    formatTime,
    formatCurrency,
    formatPostcode,
    getDirectionClass,
    getTextAlignClass
  };
};

// Language-specific placeholder texts
export const getPlaceholderText = (key: string, t: TFunction): string => {
  const placeholders = {
    email: {
      en: 'your.email@example.com',
      cy: 'eich.email@enghraifft.com',
      pl: 'twoj.email@przyklad.com',
      ur: 'آپ کا ای میل@example.com'
    },
    postcode: {
      en: 'SW1A 1AA',
      cy: 'CF10 1AA',
      pl: '00-001',
      ur: 'SW1A 1AA'
    },
    phone: {
      en: '+44 20 7946 0958',
      cy: '+44 29 2087 2087',
      pl: '+48 22 123 45 67',
      ur: '+44 20 7946 0958'
    }
  };

  const currentLang = t('language').toLowerCase();
  return placeholders[key as keyof typeof placeholders]?.[currentLang as keyof typeof placeholders.email] ||
         placeholders[key as keyof typeof placeholders]?.en || '';
};

// British English specific terms
export const getBritishTerms = (t: TFunction) => {
  return {
    drivingTest: t('testTypes:drivingTest', 'Driving Test'),
    testCentre: t('testTypes:testCentre', 'Test Centre'),
    cancelledTest: t('testTypes:cancelledTest', 'Cancelled Test'),
    practicalTest: t('testTypes:practicalTest', 'Practical Test'),
    theoryTest: t('testTypes:theoryTest', 'Theory Test'),
    provisionalLicence: t('testTypes:provisionalLicence', 'Provisional Licence'),
    drivingInstructor: t('testTypes:drivingInstructor', 'Driving Instructor'),
    dualCarriageway: t('testTypes:dualCarriageway', 'Dual Carriageway'),
    roundabout: t('testTypes:roundabout', 'Roundabout'),
    manoeuvre: t('testTypes:manoeuvre', 'Manoeuvre'),
    mirrorSignalManoeuvre: t('testTypes:mirrorSignalManoeuvre', 'Mirror, Signal, Manoeuvre'),
    showMeTellMe: t('testTypes:showMeTellMe', 'Show Me, Tell Me'),
    independentDriving: t('testTypes:independentDriving', 'Independent Driving'),
    satNav: t('testTypes:satNav', 'Sat Nav'),
    emergencyStop: t('testTypes:emergencyStop', 'Emergency Stop'),
    bayPark: t('testTypes:bayPark', 'Bay Park'),
    parallelPark: t('testTypes:parallelPark', 'Parallel Park'),
    pullUpOnRight: t('testTypes:pullUpOnRight', 'Pull Up on the Right'),
    forwardBayPark: t('testTypes:forwardBayPark', 'Forward Bay Park'),
    reverseBayPark: t('testTypes:reverseBayPark', 'Reverse Bay Park'),
    turnInRoad: t('testTypes:turnInRoad', 'Turn in the Road'),
    reverseAroundCorner: t('testTypes:reverseAroundCorner', 'Reverse Around a Corner')
  };
};

// Regional variations for different parts of the UK
export const getRegionalTerms = (region: string, t: TFunction) => {
  const regions = {
    england: {
      motorway: t('regions:motorway', 'Motorway'),
      junction: t('regions:junction', 'Junction'),
      layby: t('regions:layby', 'Lay-by'),
      dualCarriageway: t('regions:dualCarriageway', 'Dual Carriageway')
    },
    scotland: {
      motorway: t('regions:motorway', 'Motorway'),
      junction: t('regions:junction', 'Junction'),
      layby: t('regions:layby', 'Lay-by'),
      trunkRoad: t('regions:trunkRoad', 'Trunk Road')
    },
    wales: {
      motorway: t('regions:motorway', 'Motorway'),
      junction: t('regions:junction', 'Junction'),
      layby: t('regions:layby', 'Lay-by'),
      dualCarriageway: t('regions:dualCarriageway', 'Dual Carriageway')
    },
    northernIreland: {
      motorway: t('regions:motorway', 'Motorway'),
      junction: t('regions:junction', 'Junction'),
      layby: t('regions:layby', 'Lay-by'),
      dualCarriageway: t('regions:dualCarriageway', 'Dual Carriageway')
    }
  };

  return regions[region as keyof typeof regions] || regions.england;
};

// Date and time formatting for different locales
export const formatDateTime = (date: Date | string, locale: string, includeTime: boolean = false): string => {
  const d = new Date(date);

  const dateFormats = {
    en: 'en-GB',
    cy: 'cy-GB',
    pl: 'pl-PL',
    ur: 'ur-PK'
  };

  const formatLocale = dateFormats[locale as keyof typeof dateFormats] || 'en-GB';

  if (includeTime) {
    return d.toLocaleString(formatLocale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  return d.toLocaleDateString(formatLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// RTL language support utilities
export const isRTLLanguage = (language: string): boolean => {
  const rtlLanguages = ['ur', 'ar', 'he', 'fa'];
  return rtlLanguages.includes(language);
};

export const getLanguageDirection = (language: string): 'ltr' | 'rtl' => {
  return isRTLLanguage(language) ? 'rtl' : 'ltr';
};

export const getTextAlignment = (language: string): 'left' | 'right' => {
  return isRTLLanguage(language) ? 'right' : 'left';
};