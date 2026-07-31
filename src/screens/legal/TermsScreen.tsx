// src/screens/legal/TermsScreen.tsx
// Terms & Conditions for the Dhanapal DigiGold app.

import React from 'react';
import { LegalScreenShell, UpdatedPill, Section, Para, BulletList, Callout } from './LegalContent';

export default function TermsScreen() {
  return (
    <LegalScreenShell title="Terms & Conditions">
      <UpdatedPill date="1 July 2026" />

      <Para>
        These Terms & Conditions ("Terms") govern your access to and use of the Dhanapal DigiGold
        mobile application ("App"), operated by Dhanapal Jewellery ("we", "us", "our"), and the
        digital gold and silver savings schemes offered through it. By creating an account or
        enrolling in a scheme, you agree to be bound by these Terms.
      </Para>

      <Section number="1" title="Eligibility">
        <Para>
          You must be at least 18 years of age and capable of entering into a legally binding
          contract under Indian law to register on the App or join a savings scheme. Minors may
          only be enrolled by a parent or legal guardian, using the guardian's verified account.
        </Para>
      </Section>

      <Section number="2" title="Account Registration & Security">
        <BulletList
          items={[
            'You must provide accurate, current, and complete information during registration, including your name, mobile number, and address.',
            'Your account is protected by an OTP-verified login and a 4-digit MPIN. You are solely responsible for keeping your MPIN and device secure.',
            'Notify us immediately if you suspect unauthorised access to your account.',
          ]}
        />
      </Section>

      <Section number="3" title="Scheme Enrolment">
        <Para>
          The App allows you to join fixed or flexible installment savings schemes for gold or
          silver. On enrolment, you choose a scheme, an installment amount (where applicable), and
          provide KYC details (address, identity proof, and nominee information) required to
          activate your account with us.
        </Para>
        <BulletList
          items={[
            'Each scheme has its own tenure, number of installments, and terms shown on the Scheme Details page before you join.',
            'Enrolment is subject to the scheme being open for new members at the time of joining.',
            'The information you submit (KYC, nominee, address) is used to maintain your scheme ledger and passbook.',
          ]}
        />
      </Section>

      <Section number="4" title="Payments">
        <BulletList
          items={[
            'Installments are collected through the payment gateway integrated in the App. We do not store your card or bank credentials.',
            'A digital receipt is generated for every successful payment and is available in your Scheme Passbook.',
            'It is your responsibility to pay installments on or before each due date shown in the App to keep your scheme in good standing.',
          ]}
        />
        <Callout icon="card-outline">
          Payments once processed are recorded against your scheme ledger immediately; please verify
          the amount and scheme before confirming any payment.
        </Callout>
      </Section>

      <Section number="5" title="Gold/Silver Weight & Rate Ledger">
        <Para>
          Where a scheme maintains a weight ledger, the gold or silver weight credited against each
          installment is calculated using the prevailing rate published by us on the date of
          payment, as shown on the Rates screen. Rates fluctuate with the market and are not fixed
          in advance unless explicitly stated for a particular scheme.
        </Para>
      </Section>

      <Section number="6" title="Maturity & Redemption">
        <Para>
          On completion of a scheme's tenure, the accumulated amount or weight is redeemable towards
          the purchase of jewellery or bullion at any Dhanapal Jewellery branch, subject to that
          scheme's specific redemption terms communicated at the time of joining. Redemption
          requires an in-person visit with a valid ID and your scheme passbook/receipt for
          verification.
        </Para>
      </Section>

      <Section number="7" title="Cancellation & Refunds">
        <Para>
          Cancelling a scheme before maturity, and any refund of amounts paid, is governed by our
          separate Refund & Cancellation Policy, which forms part of these Terms.
        </Para>
      </Section>

      <Section number="8" title="Acceptable Use">
        <BulletList
          items={[
            'You agree not to misuse the App, attempt unauthorised access to our systems, or interfere with its normal operation.',
            'You will not use the App for any unlawful purpose or to submit false KYC or identity information.',
          ]}
        />
      </Section>

      <Section number="9" title="Intellectual Property">
        <Para>
          The Dhanapal DigiGold name, logo, app design, and all content within the App are the
          property of Dhanapal Jewellery and may not be copied, reproduced, or used without our
          prior written consent.
        </Para>
      </Section>

      <Section number="10" title="Limitation of Liability">
        <Para>
          We strive to keep the App accurate and available at all times, but we do not guarantee
          uninterrupted access. We are not liable for indirect or consequential losses arising from
          scheme enrolment decisions, market rate fluctuations, or temporary service interruptions,
          except where required by applicable law.
        </Para>
      </Section>

      <Section number="11" title="Changes to These Terms">
        <Para>
          We may update these Terms from time to time to reflect changes in our schemes, services,
          or legal requirements. Continued use of the App after an update constitutes acceptance of
          the revised Terms. Material changes will be highlighted within the App.
        </Para>
      </Section>

      <Section number="12" title="Governing Law">
        <Para>
          These Terms are governed by the laws of India, and any disputes arising from them will be
          subject to the exclusive jurisdiction of the courts having jurisdiction over our registered
          place of business.
        </Para>
      </Section>

      <Section number="13" title="Contact Us">
        <Para>
          For any questions about these Terms, please reach us through the Contact page in the App,
          or visit the About Us page for branch details and contact information.
        </Para>
      </Section>
    </LegalScreenShell>
  );
}
