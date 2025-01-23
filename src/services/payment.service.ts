import { apiCall } from "../utils/api_util.service";

// Get Stripe account status
export const getStripeAccountStatus = async () => {
  try {
    const data = await apiCall("stripe/account-status/?organization_id=2");
    return data;
  } catch (error) {
    return error;
  }
};

// Generate Stripe onboarding link
export const getStripeOnboardingLink = async (accountType: string) => {
  try {
    const data = await apiCall("stripe/onboarding-link/", "POST", {
      account_type: accountType,
    });
    return data;
  } catch (error) {
    return error;
  }
};

// Get Stripe dashboard link
export const getStripeDashboardLink = async () => {
  try {
    const data = await apiCall("stripe/dashboard-link/");
    return data;
  } catch (error) {
    return error;
  }
};

// Get payment history
export const getPaymentHistory = async () => {
  try {
    const data = await apiCall("payments/");
    return data;
  } catch (error) {
    return error;
  }
};
