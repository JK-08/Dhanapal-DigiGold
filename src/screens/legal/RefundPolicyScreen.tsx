// src/screens/legal/RefundPolicyScreen.tsx
// Refund & Cancellation Policy for the Dhanapal DigiGold app.

import React from 'react';
import { LegalScreenShell, UpdatedPill, Section, Para, BulletList, Callout } from './LegalContent';

export default function RefundPolicyScreen() {
  return (
    <LegalScreenShell title="Refund & Cancellation">
      <UpdatedPill date="1 July 2026" />

      <Para>
        This policy explains how scheme cancellations, exits, and payment refunds are handled for
        all gold and silver savings schemes offered through the Dhanapal DigiGold app.
      </Para>

      <Section number="1" title="Redemption Is Towards Jewellery/Bullion Purchase">
        <Para>
          Our savings schemes are designed to help you accumulate value towards a future gold or
          silver purchase. On maturity, the accumulated amount is redeemable against jewellery or
          bullion purchase at any Dhanapal Jewellery branch — it is not paid out as a cash refund.
        </Para>
      </Section>

      <Section number="2" title="Cancelling a Scheme Before Maturity">
        <BulletList
          items={[
            'You may request to exit a scheme before its tenure completes by visiting your nearest Dhanapal Jewellery branch with your registered ID and scheme passbook.',
            'The principal amount you have paid towards the scheme is refundable/adjustable, subject to the specific scheme\'s terms shown at the time of joining.',
            'Any joining bonus, promotional weight, or scheme-specific benefit is applicable only on successful completion of the full tenure, and is forfeited on early exit, unless stated otherwise for that scheme.',
            'Early-exit requests are processed at the branch and settled as per the scheme\'s documented terms — either as an account credit usable towards a purchase, or as a refund, at our discretion where the scheme allows it.',
          ]}
        />
      </Section>

      <Section number="3" title="Failed, Duplicate, or Erroneous Payments">
        <Para>
          If an installment payment fails after your money was debited, or the same installment is
          charged twice due to a technical error, the excess amount is automatically reversed by the
          payment gateway to your original payment method.
        </Para>
        <Callout icon="time-outline">
          Such reversals typically reflect in your account within 5–7 business days, depending on
          your bank or payment provider. If it takes longer, please contact us with your payment
          reference/receipt number.
        </Callout>
      </Section>

      <Section number="4" title="Missed Installments">
        <Para>
          Missing an installment due date does not cancel your scheme automatically. You can
          continue paying subsequent installments through the App. Extended non-payment may affect
          your eligibility for scheme-specific bonuses; please refer to your scheme's terms on the
          Scheme Details page for the exact grace period and conditions.
        </Para>
      </Section>

      <Section number="5" title="How to Request a Refund or Cancellation">
        <BulletList
          items={[
            'For a genuine payment error (failed/duplicate charge), contact us through the Contact page in the App with your receipt number.',
            'For a scheme cancellation or early exit, visit your nearest branch listed on the About Us page with your registered ID proof and scheme passbook.',
            'Our branch team will verify your scheme ledger and guide you through the applicable settlement process.',
          ]}
        />
      </Section>

      <Section number="6" title="Processing Time">
        <Para>
          Payment-error refunds are typically processed within 5–7 business days of verification.
          Scheme cancellation settlements are processed at the branch and may take longer depending
          on the scheme's specific terms and required documentation checks.
        </Para>
      </Section>

      <Section number="7" title="Contact Us">
        <Para>
          For any refund or cancellation queries, please reach us through the Contact page in the
          App, or visit the About Us page for branch phone numbers and addresses.
        </Para>
      </Section>
    </LegalScreenShell>
  );
}
