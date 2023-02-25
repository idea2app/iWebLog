import { TimeDistanceProps } from 'idea-react';

import { i18n } from '../models/Translation';

const { t } = i18n;

export const TimeOption = () =>
  ({
    unitWords: {
      ms: t('millisecond'),
      s: t('second'),
      m: t('minute'),
      H: t('hour'),
      D: t('day'),
      W: t('week'),
      M: t('month'),
      Y: t('year'),
    },
    beforeWord: t('before'),
    afterWord: t('after'),
  } as Pick<TimeDistanceProps, 'unitWords' | 'beforeWord' | 'afterWord'>);
