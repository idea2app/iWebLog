import { TimeDistanceProps } from 'idea-react';

import { i18n } from '../models/Translation';

const { t } = i18n;

export const TimeOption = () =>
  ({
    unitWords: {
      ms: t('Millisecond'),
      s: t('Second'),
      m: t('Minute'),
      H: t('Hour'),
      D: t('Day'),
      W: t('Week'),
      M: t('Month'),
      Y: t('Year'),
    },
    beforeWord: t('before'),
    afterWord: t('after'),
  } as Pick<TimeDistanceProps, 'unitWords' | 'beforeWord' | 'afterWord'>);
