import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import {
  getOrganizerSettings,
  organizerSettingsUpdate,
} from "../../../redux/action/organizerActions";
import { toast } from "react-toastify";
import { boolean } from "yup";

const OrganizerSettings = () => {
  const [allowApproval, setAllowApproval] = useState<boolean | null>(false);
  const [showModal, setShowModal] = useState(false);
  const [pendingState, setPendingState] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrganizerSettings();
  }, []);

  const fetchOrganizerSettings = async () => {
    try {
      const response = await dispatch(getOrganizerSettings()).unwrap();
      setAllowApproval(response.isApprovalAllowed);
    } catch (err) {
      setAllowApproval(null)
      toast.error("Failed to fetch Organizer setting.");
    }
  };

  const handleToggleClick = (
    newState: boolean | ((prevState: boolean) => boolean)
  ) => {
    setPendingState(newState);
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await dispatch(organizerSettingsUpdate(pendingState)).unwrap();
      setAllowApproval(pendingState);
    } catch (error) {
      toast.error("Failed to update organizer settings. Please try again.");
    } finally {
      setLoading(false);
    }

    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="w-full bg-white rounded-[4px] shadow-lg p-6">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold">Organizer Settings</h2>
      </div>

      {allowApproval === null ? (
        <div className="flex items-center justify-center p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12c0-4.97-4.03-9-9-9S3 7.03 3 12s4.03 9 9 9 9-4.03 9-9z"
          />
        </svg>
        <p className="text-sm font-medium">
          Failed to fetch Organizer setting. Please try again later.
        </p>
      </div>      
      ) : (
        <div className="flex items-center justify-between py-4">
          <div>
            <label className="text-base font-medium">
              Event Collaboration Approval
            </label>
            <p className="text-sm text-gray-500 mt-1">
              Require approval for event collaboration requests
            </p>
          </div>

          <button
            onClick={() => handleToggleClick(!allowApproval)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              allowApproval ? "bg-blue-600" : "bg-gray-200"
            }`}
            role="switch"
            aria-checked={allowApproval}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                allowApproval ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      )}

      {allowApproval && (
        <div className="mt-4 p-4 border border-blue-700 bg-blue-50 rounded-[5px]">
          <p className="text-sm text-blue-700">
            All collaboration requests will require your explicit approval
            before team members can join events.
          </p>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[5px] p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-2">
              {pendingState ? "Enable" : "Disable"} Approval Requirement
            </h3>
            <p className="text-gray-600 mb-6">
              {pendingState
                ? "When enabled, all event collaboration requests will require your explicit approval. Team members won't be able to join events automatically."
                : "When disabled, team members will be able to join events without requiring your approval. Are you sure you want to continue?"}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-[5px] hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="px-4 py-2 text-white bg-blue-600 rounded-[5px] hover:bg-blue-700 transition-colors"
              >
                {loading ? "Loading" : pendingState ? "Enable" : "Disable"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerSettings;
