// src/utils/companyLogo.ts
//
// Builds the absolute URL for a Company's LOGO (relative path returned by
// GET /company/all, e.g. "/uploads/companyLogo/xxx.webp").

import { IMAGE_BASE_URL } from '@env';
import { Company } from '../types/Company/Company';

export const getCompanyLogoUrl = (company?: Company | null): string | null => {
  const path = company?.LOGO?.trim();
  return path ? `${IMAGE_BASE_URL}${path}` : null;
};
