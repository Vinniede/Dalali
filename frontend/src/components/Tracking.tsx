import React from 'react';
import shipmentService from '../services/shipmentService';
import { formatDate, getStatusBgColor, getStatusTextColor } from '../services/utils';

interface TrackingFormProps {
  onResults?: (results: any) => void;
}

export const TrackingForm: React.FC<TrackingFormProps> = ({ onResults }) => {
  const [trackingNumber, setTrackingNumber] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await shipmentService.trackShipment(trackingNumber);
      onResults?.(response);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Shipment not found');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card-elevated max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Your Shipment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Tracking Number</label>
          <div className="flex gap-3">
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
              className="btn-primary px-6 flex-shrink-0"
            >
              {loading ? '🔄 Tracking...' : '🔍 Track'}
            </button>
          </div>
        </div>

        {error && (
          <div className="alert-error">
            <span>⚠️ {error}</span>
          </div>
        )}
      </form>
    </div>
  );
};

interface Shipment {
  id: string;
  tracking_number: string;
  sender_name: string;
  receiver_name: string;
  destination: string;
  current_status: string;
  created_at: string;
  history?: Array<{
    id: string;
    location: string;
    status: string;
    description: string;
    created_at: string;
  }>;
}

interface TrackingResultsProps {
  shipment: Shipment;
}

export const TrackingResults: React.FC<TrackingResultsProps> = ({ shipment }) => {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="card-elevated">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipment Details</h2>

        {/* Shipment Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8 pb-8 border-b border-gray-200">
          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Tracking Number</div>
            <div className="font-semibold text-lg text-primary-700 mt-1">{shipment.tracking_number}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Current Status</div>
            <div className="mt-1">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBgColor(shipment.current_status)} ${getStatusTextColor(shipment.current_status)}`}>
                {shipment.current_status}
              </span>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">From</div>
            <div className="font-semibold text-gray-900 mt-1">{shipment.sender_name}</div>
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">To</div>
            <div className="font-semibold text-gray-900 mt-1">{shipment.destination}</div>
          </div>
          <div className="col-span-2">
            <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Receiver</div>
            <div className="font-semibold text-gray-900 mt-1">{shipment.receiver_name}</div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Tracking History</h3>
        <div className="space-y-4">
          {shipment.history && shipment.history.length > 0 ? (
            shipment.history.map((record, index) => (
              <div key={record.id} className="flex gap-4 pb-6 last:pb-0 last:border-0 border-b border-gray-200">
                {/* Timeline Connector */}
                <div className="flex flex-col items-center">
                  <div className={`w-4 h-4 rounded-full border-2 border-current ${index === 0 ? 'bg-success text-success' : 'bg-secondary-500 text-secondary-500'}`}></div>
                  {index < (shipment.history?.length || 0) - 1 && (
                    <div className="w-0.5 h-12 bg-gray-300 mt-2"></div>
                  )}
                </div>

                {/* Event Content */}
                <div className="flex-1 pt-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-900">{record.status}</p>
                    {index === 0 && <span className="badge-primary">Latest</span>}
                  </div>
                  {record.location && (
                    <p className="text-sm text-gray-600">📍 {record.location}</p>
                  )}
                  {record.description && (
                    <p className="text-sm text-gray-700 mt-1">{record.description}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    {formatDate(record.created_at)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-600">No tracking history available</p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <button className="w-full btn-primary">
            📞 Contact Support for Updates
          </button>
        </div>
      </div>
    </div>
  );
};
