import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useTranslation } from "react-i18next";
import { DynamicTable } from "../../../components/DynamicTable/DynamicTable";
// import { SearchBarClear } from "../../../components/SearchBarClear/SearchBarClear";
import { Spinner } from "../../../components/Spinner/Spinner";
import { getPaymentHistory } from "../../../services/payment.service";
import "./PaymentHistory.scss";

interface PaymentHistoryItem {
  id: number;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: string;
  recipient_name: string;
  recipient_type: string;
  task_title: string;
  created_at: string;
  updated_at: string;
}

export const PaymentHistory = () => {
  var tablePageIndex = 1;
  const [currentPage, setCurrentPage] = useState(tablePageIndex);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [dataCount, setDataCount] = useState<number>(0);
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();

  const fetchPaymentHistory = async () => {
    setIsLoading(true);
    try {
      let params: any = {
        page: tablePageIndex,
        limit: itemsPerPage,
        keyword: keyword,
      };

      if (searchValue === "succeeded") {
        params.status = "succeeded";
      } else if (searchValue === "processing") {
        params.status = "processing";
      } else if (searchValue === "failed") {
        params.status = "failed";
      }

      const response:any = await getPaymentHistory();
      if (response && !response.error) {
        setPayments(response.data);
        setDataCount(response.count);
      }
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [keyword, searchValue]);

  const handlePageChange = async (pageNumber: number) => {
    setCurrentPage(pageNumber);
    tablePageIndex = pageNumber;
    fetchPaymentHistory();
  };

  const attributeLabels = {
    task_title: "Task",
    recipient_name: "Recipient",
    recipient_type: "Recipient Type",
    amount: "Amount",
    status: "Status",
    created_at: "Date",
  };

  const initialValues = {
    keyword: "",
  };

  return (
    <div className="payment-history p-lg-5 p-md-5 p-3">
      {/* <Formik initialValues={initialValues} onSubmit={console.log}>
        {({ handleChange, handleSubmit, values }) => (
          <Form>
            <div className="row space-between align-items-end mb-4">
              <div className="col-lg-6 col-md-6 col-12">
                <SearchBarClear
                  widthClass={"search-size3 search-bar-radious"}
                  onChange={setKeyword}
                  placeholder="Search payments"
                  label="Search"
                  name="keyword"
                  clearFunction={() => setKeyword("")}
                />
              </div>
            </div>
          </Form>
        )}
      </Formik> */}

      <div className="d-flex justify-content-between mt-5 mb-5">
        <div className="d-flex flex-lg-row flex-md-row flex-column">
          <div
            className={`filter-btn ${searchValue === "" ? "act" : ""}`}
            onClick={() => setSearchValue("")}
          >
            All
          </div>
          <div
            className={`filter-btn ${searchValue === "succeeded" ? "act" : ""}`}
            onClick={() => setSearchValue("succeeded")}
          >
            Succeeded
          </div>
          <div
            className={`filter-btn ${
              searchValue === "processing" ? "act" : ""
            }`}
            onClick={() => setSearchValue("processing")}
          >
            Processing
          </div>
          <div
            className={`filter-btn ${searchValue === "failed" ? "act" : ""}`}
            onClick={() => setSearchValue("failed")}
          >
            Failed
          </div>
        </div>
      </div>

      {isLoading ? (
        <Spinner size="large" />
      ) : payments.length > 0 ? (
        <DynamicTable
          data={payments.map((payment) => ({
            ...payment,
            amount: `${payment.currency.toUpperCase()} ${(
              payment.amount / 100
            ).toFixed(2)}`,
            created_at: new Date(payment.created_at).toLocaleDateString(),
            status: (
              <span className={`status ${payment.status.toLowerCase()}`}>
                {payment.status}
              </span>
            ),
          }))}
          attributeLabels={attributeLabels}
        />
      ) : (
        <div className="text-center p-4">
          <h4>{t("No data available")}</h4>
        </div>
      )}
    </div>
  );
};
