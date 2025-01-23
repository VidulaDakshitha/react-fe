import "./PaymentSettings.scss";
import { useState, useEffect } from "react";
import Button from "../../../core/Button/Button";
import { toast } from "react-toastify";
import { ErrorNotification } from "../../../components/ErrorNotification/ErrorNotification";
import {
  getStripeAccountStatus,
  getStripeOnboardingLink,
  getStripeDashboardLink,
} from "../../../services/payment.service";

interface StripeStatus {
  charges_enabled: boolean;
  payouts_enabled: boolean;
  requirements: {
    alternatives: string[];
    current_deadline: string | null;
    currently_due: string[];
    disabled_reason: string | null;
    errors: string[];
    eventually_due: string[];
    past_due: string[];
    pending_verification: string[];
  };
  capabilities: {
    bancontact_payments: string;
    blik_payments: string;
    card_payments: string;
    eps_payments: string;
    giropay_payments: string;
    ideal_payments: string;
    klarna_payments: string;
    transfers: string;
  };
}

interface StripeAccountStatus {
  id: number;
  stripe_account_id: string;
  is_verified: boolean;
  is_authorized: boolean;
  account_type: string;
  can_transfer: boolean;
  can_charge: boolean;
  requirements: any;
  owner_name: string;
  owner_email: string;
  owner_type: string;
  created_at: string;
  updated_at: string;
  stripe_status: StripeStatus;
}

export const PaymentSettings = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [accountStatus, setAccountStatus] =
    useState<StripeAccountStatus | null>(null);

  useEffect(() => {
    fetchAccountStatus();
  }, []);

  const fetchAccountStatus = async () => {
    try {
      const response: any = await getStripeAccountStatus();
      if (response?.data) {
        setAccountStatus(response.data);
      } else if (response?.error) {
        ErrorNotification(response.error);
      }
    } catch (error) {
      ErrorNotification("Failed to fetch account status");
    }
  };

  const handleStripeOnboarding = async () => {
    setIsLoading(true);
    try {
      const response: any = await getStripeOnboardingLink("company");
      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else if (response?.error) {
        ErrorNotification(response.error);
      }
    } catch (error) {
      ErrorNotification("Failed to start onboarding process");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDashboardAccess = async () => {
    setIsLoading(true);
    try {
      const response: any = await getStripeDashboardLink();
      if (response?.data?.url) {
        window.location.href = response.data.url;
      } else if (response?.error) {
        ErrorNotification(response.error);
      }
    } catch (error) {
      ErrorNotification("Failed to access Stripe dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="payment-settings-container p-lg-5 p-md-5 p-3">
      <div className="settings-header">
        <h2>Payment Settings</h2>
        <p>Manage your payment account and preferences</p>
      </div>

      <div className="account-status-section">
        {accountStatus ? (
          <>
            <div className="status-header">
              <h3>Account Status</h3>
              <span
                className={`status-badge ${
                  accountStatus.is_verified ? "verified" : "pending"
                }`}
              >
                {accountStatus.is_verified
                  ? "Verified"
                  : "Pending Verification"}
              </span>
            </div>

            <div className="account-info">
              <h4>Account Information</h4>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Account Owner</span>
                  <span className="info-value">{accountStatus.owner_name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">
                    {accountStatus.owner_email}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Account Type</span>
                  <span className="info-value">
                    {accountStatus.account_type}
                  </span>
                </div>
              </div>
            </div>

            {accountStatus.stripe_status?.requirements?.eventually_due?.length >
              0 && (
              <div className="requirements-section">
                <h4>Required Actions</h4>
                <ul>
                  {accountStatus.stripe_status.requirements.eventually_due.map(
                    (req, index) => (
                      <li key={index}>{req}</li>
                    )
                  )}
                </ul>
              </div>
            )}

            <div className="capabilities-section">
              <h4>Account Capabilities</h4>
              <div className="capabilities-grid">
                <div className="capability-item">
                  <span className="capability-label">Card Payments</span>
                  <span
                    className={`capability-status ${
                      accountStatus.stripe_status?.capabilities
                        ?.card_payments || ""
                    }`}
                  >
                    {accountStatus.stripe_status?.capabilities?.card_payments ||
                      "Not Available"}
                  </span>
                </div>
                <div className="capability-item">
                  <span className="capability-label">Transfers</span>
                  <span
                    className={`capability-status ${
                      accountStatus.stripe_status?.capabilities?.transfers || ""
                    }`}
                  >
                    {accountStatus.stripe_status?.capabilities?.transfers ||
                      "Not Available"}
                  </span>
                </div>
                <div className="capability-item">
                  <span className="capability-label">Charges</span>
                  <span
                    className={`capability-status ${
                      accountStatus.stripe_status?.charges_enabled
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {accountStatus.stripe_status?.charges_enabled
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </div>
                <div className="capability-item">
                  <span className="capability-label">Payouts</span>
                  <span
                    className={`capability-status ${
                      accountStatus.stripe_status?.payouts_enabled
                        ? "active"
                        : "inactive"
                    }`}
                  >
                    {accountStatus.stripe_status?.payouts_enabled
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            <div className="actions-section">
              <Button
                buttonText="Access Stripe Dashboard"
                className="task-btn"
                onClickHandler={handleDashboardAccess}
                isLoading={isLoading}
                type="button"
              />
            </div>
          </>
        ) : (
          <div className="onboarding-section">
            <h3>Set Up Payment Account</h3>
            <p>
              Connect your Stripe account to start receiving payments for
              completed tasks.
            </p>
            <Button
              buttonText="Set Up Stripe Account"
              className="task-btn"
              onClickHandler={handleStripeOnboarding}
              isLoading={isLoading}
              type="button"
            />
          </div>
        )}
      </div>
    </div>
  );
};
