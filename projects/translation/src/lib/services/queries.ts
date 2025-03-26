import { Apollo_gql, GraphQueryPayload } from '@camelot/server';

import { featureProps } from './dto/feature';
import { translationProps } from './dto/translation';

export function GET_TRANSLATIONS(locale: string, feature: string, partner?: string): GraphQueryPayload {
  const filters = { feature: { name: { eq: feature } }, partner: { UID: { eq: partner } } };
  return {
    query: Apollo_gql`
      query Translations($locale: I18NLocaleCode!, $filters: TranslationFiltersInput!) {
        translations(locale: $locale, filters: $filters, pagination: { pageSize: 50000 }) {
          data {
            id
            attributes {
              ${translationProps.get('key')}
              ${translationProps.get('value')}
              ${translationProps.get('feature')} {
                data {
                  id
                  attributes {
                    ${featureProps.get('name')}
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      locale: locale,
      filters: filters,
    },
  };
}
