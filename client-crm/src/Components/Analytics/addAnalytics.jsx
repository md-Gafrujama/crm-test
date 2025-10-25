import {useState} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config/api.js";
import { getCompanyIdFromToken } from "../../utils/auth.js";

const AddAnalytics=()=>{
  // Add Analytics form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // New fields for GA Property ID and API Secret Key
  const [gaPropertyId, setGaPropertyId] = useState("");
  const [apiSecretKey, setApiSecretKey] = useState("");

  // Add Analytics handlers
  const openAddAnalyticsForm = () => {
    setJsonError("");
    setShowAddForm(true);
  };
  const closeAddAnalyticsForm = () => {
    setShowAddForm(false);
    setJsonInput("");
    setJsonError("");
    setIsSubmittingForm(false);
    setGaPropertyId("");
    setApiSecretKey("");
  };
  const handleAddAnalyticsSubmit = async (e) => {
    e.preventDefault();
    setJsonError("");
    let parsed;
    try {
      parsed = JSON.parse(jsonInput || "{}");
    } catch (err) {
      setJsonError("Invalid JSON: " + err.message);
      return;
    }
    setIsSubmittingForm(true);
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await axios.post(
          `${API_BASE_URL}/api/analytics/custom`,
          {
            companyId: getCompanyIdFromToken(),
            keyFile: parsed,
            gaPropertyId: gaPropertyId,
            APISecretKey: apiSecretKey,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Analytics added successfully", { position: "top-right" });
      } else {
        console.log("Parsed analytics JSON:", { keyFile: parsed, gaPropertyId, APISecretKey: apiSecretKey });
        toast.success("JSON parsed (no token) — check console", { position: "top-right" });
      }
      closeAddAnalyticsForm();
    } catch (err) {
      console.error("Failed to add analytics:", err);
      toast.error(err?.response?.data?.message || err.message || "Failed to add analytics", {
        position: "top-right",
      });
    } finally {
      setIsSubmittingForm(false);
    }
  };
  return(
    <>
      {/* Analytics Header */}
      <div className="text-center space-y-3 mb-8">
        {/* Add Analytics Button */}
        <div className="flex justify-center mb-2">
          <button
            onClick={openAddAnalyticsForm}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-sky-600 text-white hover:bg-sky-700 focus:outline-none"
          >
            Add Analytics
          </button>
        </div>
        {/* Add Analytics Form */}
        {showAddForm && (
          <div className="mb-6 max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
            <form onSubmit={handleAddAnalyticsSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                  Key File
                </label>
                <textarea
                  value={jsonInput}
                  onChange={(e) => setJsonInput(e.target.value)}
                  placeholder='e.g. { "type": "service_account", ... }'
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm px-3 py-2 h-36 resize-y focus:ring-2 focus:ring-sky-500"
                  aria-label="JSON input"
                  required
                />
                {jsonError && (
                  <div className="text-sm text-red-600 dark:text-red-400 mt-1">
                    {jsonError}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                  GA Property ID
                </label>
                <input
                  type="text"
                  value={gaPropertyId}
                  onChange={(e) => setGaPropertyId(e.target.value)}
                  placeholder='e.g. properties/510033175'
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm px-3 py-2 focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200">
                  API Secret Key
                </label>
                <input
                  type="text"
                  value={apiSecretKey}
                  onChange={(e) => setApiSecretKey(e.target.value)}
                  placeholder='e.g. eJwUTXOKTR-_tCm_n-ytEw'
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-sm px-3 py-2 focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={closeAddAnalyticsForm}
                  className="px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  disabled={isSubmittingForm}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={isSubmittingForm}
                >
                  {isSubmittingForm ? "Submitting..." : "Add Analytics"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  )
}
export default AddAnalytics;