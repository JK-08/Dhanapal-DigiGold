// src/screens/legal/PrivacyPolicyScreen.tsx
// Privacy Policy for the Dhanapal DigiGold app.

import React from 'react';
import { LegalScreenShell, UpdatedPill, Section, Para, BulletList, Callout } from './LegalContent';

export default function PrivacyPolicyScreen() {
  return (
    <LegalScreenShell title="Privacy Policy">
      <UpdatedPill date="1 July 2026" />

      <Para>
        This Privacy Policy explains how Dhanapal Jewellery ("we", "us", "our") collects, uses, and
        protects your personal information when you use the Dhanapal DigiGold app ("App"). By using
        the App, you consent to the practices described here.
      </Para>

      <Section number="1" title="Information We Collect">
        <BulletList
          items={[
            'Identity & contact details: name, mobile number, email address, date of birth, gender, and residential address.',
            'KYC information: Aadhaar and PAN details submitted when joining a scheme, used solely for identity verification and regulatory compliance.',
            'Scheme & payment data: the schemes you join, installment amounts, payment history, receipts, and nominee details.',
            'Device & usage data: device identifiers, app version, and diagnostic/crash information used to improve app stability.',
            'Communication data: OTPs sent to verify your mobile number, and any messages you send us through the Contact page.',
          ]}
        />
      </Section>

      <Section number="2" title="How We Use Your Information">
        <BulletList
          items={[
            'To create and manage your account, and to enrol and maintain your gold/silver savings schemes.',
            'To process payments, generate receipts, and maintain your scheme passbook and ledger.',
            'To verify your identity via OTP and to secure your account with MPIN-based login.',
            'To send you scheme reminders, payment confirmations, and important notifications about your account.',
            'To comply with KYC and other regulatory obligations applicable to gold savings schemes.',
            'To improve the App\'s performance and fix issues, using aggregated, non-identifying diagnostic data.',
          ]}
        />
      </Section>

      <Section number="3" title="How We Share Your Information">
        <Para>
          We do not sell your personal information. We share it only where necessary:
        </Para>
        <BulletList
          items={[
            'With payment gateway providers, solely to process your installment payments securely.',
            'With SMS/OTP service providers, solely to deliver verification codes to your registered mobile number.',
            'With regulatory or government authorities, where required by applicable law.',
            'With our own branch staff, strictly for scheme servicing and redemption verification.',
          ]}
        />
      </Section>

      <Section number="4" title="Data Security">
        <Para>
          We use industry-standard safeguards to protect your data, including encrypted network
          connections (HTTPS), OTP-based authentication, and a locally-secured MPIN for app access.
          Access to your scheme and KYC data is restricted to authorised personnel only.
        </Para>
      </Section>

      <Section number="5" title="Data Retention">
        <Para>
          We retain your account and scheme data for as long as your account is active and for a
          reasonable period thereafter, as required to comply with our legal, accounting, and
          regulatory obligations (including KYC record-keeping requirements).
        </Para>
      </Section>

      <Section number="6" title="Your Rights">
        <BulletList
          items={[
            'You can view and update your personal information from the Profile section of the App at any time.',
            'You may request correction of inaccurate data or ask us about the data we hold on you.',
            'You may request deletion of your account via Profile → Delete Account, subject to completion of any active scheme obligations and statutory record-keeping requirements.',
          ]}
        />
      </Section>

      <Section number="7" title="Children's Privacy">
        <Para>
          The App is not directed at individuals under 18. Accounts for minors may only be created
          and operated by a parent or legal guardian in their own name.
        </Para>
      </Section>

      <Section number="8" title="Changes to This Policy">
        <Para>
          We may update this Privacy Policy periodically to reflect changes in our practices or
          legal requirements. Material updates will be highlighted within the App, and continued use
          after an update constitutes acceptance of the revised policy.
        </Para>
      </Section>

      <Section number="9" title="Contact Us">
        <Para>
          For questions about this Privacy Policy or to exercise your data rights, please reach us
          through the Contact page in the App, or visit the About Us page for branch contact details.
        </Para>
        <Callout icon="shield-checkmark-outline">
          We take the protection of your KYC and financial information seriously and continuously
          review our security practices to keep your data safe.
        </Callout>
      </Section>
    </LegalScreenShell>
  );
}
