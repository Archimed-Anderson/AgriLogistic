import { FinancialSuite } from '@/app/components/FinancialSuite';

/**
 * Customer-facing payments page.
 * This route exists because the sidebar links to `/customer/payments`.
 * In the current UI kit, `FinancialSuite` is the closest available module.
 */
export function PaymentsPage() {
  return <FinancialSuite />;
}
