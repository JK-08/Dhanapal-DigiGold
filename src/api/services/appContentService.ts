// src/api/services/appContentService.ts

import { callApi } from '../apiClient';
import { APP_CONTENT } from '../endpoints';
import { AppContent } from '../../types/AppContent/AppContent';

export const appContentService = {
  /**
   * GET /api/v1/app-content/{id}
   * Use SchemeId to fetch a scheme's Terms & Conditions HTML,
   * or "FAQ" to fetch the FAQ HTML shown on the Contact screen.
   */
  getById: (id: string | number) =>
    callApi<null, AppContent>({
      method: 'get',
      url:    APP_CONTENT.BY_ID(id),
    }),
};
