import React from "react";
import shipmentService from "../services/shipmentService";
import {
  formatDate,
  getStatusBgColor,
  getStatusTextColor,
} from "../services/utils";

interface TrackingFormProps {
  onResults?: (results: any) => void;
  initialTrackingNumber?: string;
}

export const TrackingForm: React.FC<TrackingFormProps> = ({
  onResults,
  initialTrackingNumber = "",
}) => {
  const [trackingNumber, setTrackingNumber] = React.useState(
    initialTrackingNumber,
  );
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setTrackingNumber(initialTrackingNumber);
  }, [initialTrackingNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await shipmentService.trackShipment(
        trackingNumber.trim(),
      );
      onResults?.(response);
    } catch (err: any) {
      setError(err.response?.data?.message || "Shipment not found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-elevated mx-auto max-w-3xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">
        Track Your Shipment
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Tracking Number
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g., DEX123456ABC"
              className="input-field flex-1"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 sm:flex-shrink-0"
            >
              {loading ? "Tracking..." : "Track"}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert-error">
            <span>{error}</span>
          </div>
        )}
      </form>
    </div>
  );
};

interface TrackingHistoryRecord {
  id: string;
  location?: string;
  status: string;
  description?: string;
  created_at: string;
}

interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  receiver_phone?: string;
  destination: string;
  origin_branch_name?: string;
  origin_country?: string;
  cargo_description?: string;
  weight?: number;
  volume?: number;
  service_type?: string;
  current_status: string;
  created_at: string;
  latest_update?: TrackingHistoryRecord | null;
  history?: TrackingHistoryRecord[];
}

interface TrackingResultsProps {
  shipment: Shipment;
}

const TrackingStat: React.FC<{ label: string; value?: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
      {label}
    </p>
    <div className="mt-2 text-sm font-semibold text-gray-900 sm:text-base">
      {value || "Not available"}
    </div>
  </div>
);

export const TrackingResults: React.FC<TrackingResultsProps> = ({
  shipment,
}) => {
  const latestLocation =
    shipment.latest_update?.location || shipment.destination;

  // Check history to determine which states the shipment has passed through
  const hasBeenInTransit = shipment.history?.some(h => h.status === 'In Transit') ?? false;
  const hasBeenDelayed = shipment.history?.some(h => h.status === 'Delayed') ?? false;
  const hasBeenDelivered = shipment.history?.some(h => h.status === 'Delivered') ?? false;

  return (
    <div className="mx-auto mt-8 max-w-4xl">
      <div className="card-elevated">
        <div className="mb-8 rounded-2xl bg-gradient-to-r from-primary-50 to-secondary-50 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary-700">
                Tracking Result
              </p>
              <h2 className="mt-2 break-all text-2xl font-bold text-gray-900 sm:text-3xl">
                {shipment.tracking_number}
              </h2>
              <p className="mt-2 text-sm text-gray-600 sm:text-base">
                Shipment created on {formatDate(shipment.created_at)}
              </p>
            </div>
            <span
              className={`inline-flex items-center self-start rounded-full px-4 py-2 text-sm font-semibold ${getStatusBgColor(shipment.current_status)} ${getStatusTextColor(shipment.current_status)}`}
            >
              {shipment.current_status}
            </span>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <TrackingStat
            label="Country of Origin"
            value={shipment.origin_country || shipment.origin_branch_name}
          />
          <TrackingStat label="Destination" value={shipment.destination} />
          <TrackingStat label="Receiver" value={shipment.receiver_name} />
          <TrackingStat label="Current Location" value={latestLocation} />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <TrackingStat label="Service Type" value={shipment.service_type} />
          <TrackingStat
            label="Weight"
            value={shipment.weight ? `${shipment.weight} kg` : undefined}
          />
          <TrackingStat
            label="Volume"
            value={shipment.volume ? `${shipment.volume} m3` : undefined}
          />
        </div>

        {shipment.cargo_description && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Shipment Description
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-700 sm:text-base">
              {shipment.cargo_description}
            </p>
          </div>
        )}

        {/* Tracking Progress Visual Indicator */}
        <div className="mb-8">
          <h3 className="mb-6 text-2xl font-bold text-gray-900">
            Shipment Progress
          </h3>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-8">
            {["Created", "In Transit", "Delivered", "Delayed"].map(
              (status, index, arr) => {
                // Check if step has been completed based on history
                const isCompleted =
                  status === "Created" ||
                  (status === "In Transit" && hasBeenInTransit) ||
                  (status === "Delivered" && hasBeenDelivered) ||
                  (status === "Delayed" && hasBeenDelayed);

                const isCurrent = shipment.current_status === status;

                const getStepColor = () => {
                  if (isCurrent) return "bg-primary-600 text-white";
                  if (isCompleted) return "bg-success text-white";
                  return "bg-gray-200 text-gray-400";
                };

                return (
                  <div key={status} className="flex items-center flex-1">
                    {/* Step Circle */}
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-all duration-300 ${getStepColor()} ${isCurrent ? "ring-2 ring-offset-2 ring-primary-600" : ""}`}
                      >
                        {isCompleted ? "✓" : index + 1}
                      </div>
                      <p
                        className={`mt-2 text-xs font-semibold uppercase tracking-wide text-center ${
                          isCurrent
                            ? "text-primary-600"
                            : isCompleted
                              ? "text-success"
                              : "text-gray-400"
                        }`}
                      >
                        {status}
                      </p>
                    </div>

                    {/* Connector Line */}
                    {index < arr.length - 1 && (
                      <div className="flex-1 mx-2 h-1 bg-gray-200 relative">
                        <div
                          className="h-full bg-success transition-all duration-500"
                          style={{
                            width: isCompleted ? "100%" : "0%",
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>

          {/* Current Status Message */}
          <div
            className={`rounded-lg p-4 text-center ${
              shipment.current_status === "Delivered"
                ? "bg-success bg-opacity-10 border border-success border-opacity-20"
                : shipment.current_status === "In Transit"
                  ? "bg-warning bg-opacity-10 border border-warning border-opacity-20"
                  : shipment.current_status === "Delayed"
                    ? "bg-error bg-opacity-10 border border-error border-opacity-20"
                    : "bg-info-100 border border-info-300"
            }`}
          >
            <p
              className={`font-semibold text-sm ${
                shipment.current_status === "Delivered"
                  ? "text-success"
                  : shipment.current_status === "In Transit"
                    ? "text-warning"
                    : shipment.current_status === "Delayed"
                      ? "text-error"
                      : "text-info-900"
              }`}
            >
              {shipment.current_status === "Created" &&
                "Your shipment has been created and is being prepared for dispatch"}
              {shipment.current_status === "In Transit" &&
                "Your shipment is currently in transit to its destination"}
              {shipment.current_status === "Delivered" &&
                "🎉 Your shipment has been delivered successfully!"}
              {shipment.current_status === "Delayed" &&
                "⏱️ Your shipment is temporarily delayed - we are working to resolve this"}
            </p>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-bold text-gray-900">
            Tracking Timeline
          </h3>
          {shipment.latest_update && (
            <p className="text-sm text-gray-500">
              Last updated {formatDate(shipment.latest_update.created_at)}
            </p>
          )}
        </div>

        <div className="space-y-3">
          {shipment.history && shipment.history.length > 0 ? (
            shipment.history
              .slice()
              .reverse()
              .map((record, index) => {
                const dateTime = new Date(record.created_at);
                const date = dateTime.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
                const time = dateTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={record.id}
                    className="flex gap-4 rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`h-4 w-4 rounded-full border-2 ${
                          index === 0
                            ? "bg-success border-success"
                            : "bg-secondary-500 border-secondary-500"
                        }`}
                      ></div>
                      {index < (shipment.history?.length || 0) - 1 && (
                        <div className="mt-2 h-12 w-0.5 bg-gray-300"></div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-bold text-gray-900">
                              {record.status}
                            </p>
                            {index === 0 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary-100 text-primary-700">
                                Current
                              </span>
                            )}
                          </div>
                          {record.location && (
                            <p className="text-sm text-gray-600 mt-1">
                              📍 {record.location}
                            </p>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xs font-semibold text-gray-700">
                            {date}
                          </p>
                          <p className="text-xs text-gray-500">{time}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 py-12 text-center">
              <p className="text-gray-600 font-medium">
                📦 Shipment journey tracking will appear here
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <button className="btn-primary w-full">
            Contact Support for Updates
          </button>
        </div>
      </div>
    </div>
  );
};
