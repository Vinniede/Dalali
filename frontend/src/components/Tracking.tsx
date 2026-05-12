import React from 'react';
import shipmentService from '../services/shipmentService';
import { formatDate, getStatusBgColor, getStatusTextColor } from '../services/utils';

interface TrackingFormProps {
  onResults?: (results: any) => void;
  initialTrackingNumber?: string;
}

export const TrackingForm: React.FC<TrackingFormProps> = ({
  onResults,
  initialTrackingNumber = '',
}) => {
  const [trackingNumber, setTrackingNumber] = React.useState(initialTrackingNumber);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    setTrackingNumber(initialTrackingNumber);
  }, [initialTrackingNumber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await shipmentService.trackShipment(trackingNumber.trim());
      onResults?.(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Shipment not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-elevated mx-auto max-w-3xl">
      <h2 className="mb-6 text-2xl font-bold text-gray-900">Track Your Shipment</h2>
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
              {loading ? 'Tracking...' : 'Track'}
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

const TrackingStat: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
    <div className="mt-2 text-sm font-semibold text-gray-900 sm:text-base">
      {value || 'Not available'}
    </div>
  </div>
);

export const TrackingResults: React.FC<TrackingResultsProps> = ({ shipment }) => {
  const latestLocation = shipment.latest_update?.location || shipment.destination;

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
          <TrackingStat label="Origin Branch" value={shipment.origin_branch_name} />
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

        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Tracking History</h3>
          {shipment.latest_update && (
            <p className="text-sm text-gray-500">
              Last updated {formatDate(shipment.latest_update.created_at)}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {shipment.history && shipment.history.length > 0 ? (
            shipment.history
              .slice()
              .reverse()
              .map((record, index) => (
                <div
                  key={record.id}
                  className="flex gap-3 rounded-lg border border-gray-200 p-4 sm:gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-4 w-4 rounded-full border-2 border-current ${
                        index === 0 ? 'bg-success text-success' : 'bg-secondary-500 text-secondary-500'
                      }`}
                    ></div>
                    {index < (shipment.history?.length || 0) - 1 && (
                      <div className="mt-2 h-full min-h-10 w-0.5 bg-gray-300"></div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-gray-900">{record.status}</p>
                          {index === 0 && <span className="badge-primary">Latest</span>}
                        </div>
                        {record.location && (
                          <p className="mt-1 text-sm text-gray-600">{record.location}</p>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 sm:text-sm">
                        {formatDate(record.created_at)}
                      </p>
                    </div>

                    {record.description && (
                      <p className="mt-2 break-words text-sm text-gray-700 sm:text-base">
                        {record.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
          ) : (
            <div className="rounded-lg border border-gray-200 bg-gray-50 py-8 text-center">
              <p className="text-gray-600">No tracking history available</p>
            </div>
          )}
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <button className="btn-primary w-full">Contact Support for Updates</button>
        </div>
      </div>
    </div>
  );
};
