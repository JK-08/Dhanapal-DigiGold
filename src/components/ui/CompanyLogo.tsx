// src/components/ui/CompanyLogo.tsx
//
// Renders the company logo from the /company/all API (LOGO field). Falls
// back to the bundled local logo when no company data is loaded yet, or the
// remote image fails to load.

import React, { useEffect, useState } from 'react';
import { Image, ImageResizeMode, ImageStyle, StyleProp } from 'react-native';
import { Company } from '../../types/Company/Company';
import { getCompanyLogoUrl } from '../../utils/companyLogo';
import FALLBACK_LOGO from '../../assets/company/logo.png';

type Props = {
  company?: Company | null;
  style?: StyleProp<ImageStyle>;
  resizeMode?: ImageResizeMode;
};

export default function CompanyLogo({ company, style, resizeMode = 'contain' }: Props) {
  const logoUrl = getCompanyLogoUrl(company);
  const [failed, setFailed] = useState(false);

  useEffect(() => { setFailed(false); }, [logoUrl]);

  const source = logoUrl && !failed ? { uri: logoUrl } : FALLBACK_LOGO;

  return (
    <Image
      source={source}
      style={style}
      resizeMode={resizeMode}
      onError={() => setFailed(true)}
    />
  );
}
