// src/types/Razorpay/Razorpay.ts

import { NMData } from '../Member/NMData';

// ── Generic backend ApiResponse wrapper ──────────────────────────
export interface ApiResponse<T = unknown> {
  status:  'success' | 'error';
  code:    string;
  message: string;
  data?:   T;
}

// ── create-order REQUEST  (sent TO backend — all uppercase keys) ──
//
// The backend's /razorpay/create-order now parks the FULL member/installment
// payload (NMDATA or SCHEMEDETAILS) in a temp table the moment the order is
// created, keyed off NEWJOIN (sent as a query param — see razorpayService).
// It is only turned into a real PERSONALINFO/SCHEMEMAST row (new join) or
// SCHEMECOLLECT/SCHEMETRAN row (installment) once the payment is confirmed —
// either by the app calling /verify-payment, or by the Razorpay webhook,
// whichever arrives first. So the app no longer calls /member/create or
// /account/insert itself after verifying; the backend does it.
export interface CreateOrderRequest {
  AMOUNT:              number;   // rupees — backend multiplies by 100 for paise
  CURRENCY:            string;   // 'INR'
  RECEIPT:             string;   // unique receipt string
  SCHEMEID?:           string;
  GROUPCODE:           string;
  INSTALLMENTNUMBER?:  number;
  REGNO:               string;
  // Full payload to park — exactly ONE of these is required depending on NEWJOIN.
  // NMData is the same type used for /api/v1/member/create — field names are
  // verified against the backend's Java model there.
  NMDATA?:             NMData;               // NEWJOIN = true  (new member joining a scheme)
  SCHEMEDETAILS?:      SchemeCollectInsert;   // NEWJOIN = false (existing member paying an installment)
}

// ── create-order RESPONSE (received FROM backend) ─────────────────
export interface CreateOrderData {
  order_id:  string;
  key:       string;
  amount:    number;   // paise
  currency:  string;
  name?:     string;
  email?:    string;
  contact?:  string;
}

// ── SCHEMEDETAILS sub-DTO (sent inside CreateOrderRequest above) ──────────
export interface SchemeCollectInsert {
  groupCode?:    string;
  regNo?:        string;
  rDate?:        string;   // yyyy-MM-dd 00:00:00
  amount?:       string;
  modePay?:      string;
  accCode?:      string;
  updateTime?:   string;
  installment?:  string;
  weight?:       string;
  sWeight?:      string;
  userID?:       string;
  schemeId?:     number;
  chqBankCode?:  string;   // paymentMode  e.g. "RAZORPAY"
  chqCardNo?:    string;   // merchantTxnNo — receipt at create-order time (payment_id not known yet)
  chqBranch?:    string;   // paymentSubInstType
  chkBank?:      string;
  chqRtnReason?: string;
}

// ── verify-payment REQUEST ────────────────────────────────────────
// Backend binds @RequestBody Map<String,String> — ONLY these three flat
// fields are accepted. userDetails is no longer sent here; the full
// member/installment payload already went up with /create-order (NMDATA /
// SCHEMEDETAILS) and the backend moves it into the real DB itself.
export interface VerifyPaymentRequest {
  razorpay_payment_id: string;
  razorpay_order_id:   string;
  razorpay_signature:  string;
}

// ── verify-payment RESPONSE ───────────────────────────────────────
// Matches RazorpayService.verifyPayment()'s `data` map. `processResult` is
// the string returned by processPendingPayment() — e.g. "PROCESSED: {...}"
// with the created member/installment result, "ALREADY_PROCESSED" if the
// webhook already claimed it, or "PROCESS_FAILED: ..." on error.
export interface VerifyPaymentData {
  paymentId?:        string;
  orderId:            string;
  amount?:            number;
  processResult:      string | null;
  alreadyProcessed?:  boolean;
}

// ── payment-failed REQUEST ────────────────────────────────────────
export interface PaymentFailedRequest {
  razorpay_order_id: string;
}

// ── Razorpay checkout success payload (from WebView) ─────────────
export interface RazorpaySuccessPayment {
  razorpay_payment_id: string;
  razorpay_order_id:   string;
  razorpay_signature:  string;
}

// ── Razorpay checkout error payload ───────────────────────────────
export interface RazorpayError {
  code:        string;
  description: string;
  source?:     string;
  step?:       string;
  reason?:     string;
  metadata?: {
    payment_id?: string;
    order_id?:   string;
  };
}
