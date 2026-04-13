import { useState } from 'react';
import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';

export default function TicketFilters({ filters, onFilterChange, onReset }) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'pending', label: 'Pending' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
    { value: 'reopened', label: 'Reopened' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' },
    { value: 'critical', label: 'Critical' },
  ];

  const categoryOptions = [
    { value: 'hardware', label: 'Hardware' },
    { value: 'software', label: 'Software' },
    { value: 'network', label: 'Network' },
    { value: 'email', label: 'Email' },
    { value: 'account', label: 'Account Access' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (name, value) => {
    onFilterChange({ ...filters, [name]: value });
  };

  const handleReset = () => {
    onReset();
    setShowAdvanced(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          name="search"
          label="Search"
          placeholder="Search tickets..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
        />

        <Select
          name="status"
          label="Status"
          value={filters.status || ''}
          onChange={(e) => handleChange('status', e.target.value)}
          options={statusOptions}
          placeholder="All statuses"
        />

        <Select
          name="priority"
          label="Priority"
          value={filters.priority || ''}
          onChange={(e) => handleChange('priority', e.target.value)}
          options={priorityOptions}
          placeholder="All priorities"
        />

        <Select
          name="category"
          label="Category"
          value={filters.category || ''}
          onChange={(e) => handleChange('category', e.target.value)}
          options={categoryOptions}
          placeholder="All categories"
        />
      </div>

      {/* Advanced Filters Toggle */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-odpp-blue hover:underline focus:outline-none"
        >
          {showAdvanced ? '− Hide Advanced Filters' : '+ Show Advanced Filters'}
        </button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            name="created_from"
            type="date"
            label="Created From"
            value={filters.created_from || ''}
            onChange={(e) => handleChange('created_from', e.target.value)}
          />

          <Input
            name="created_to"
            type="date"
            label="Created To"
            value={filters.created_to || ''}
            onChange={(e) => handleChange('created_to', e.target.value)}
          />

          <Input
            name="requester"
            label="Requester"
            placeholder="Filter by requester..."
            value={filters.requester || ''}
            onChange={(e) => handleChange('requester', e.target.value)}
          />
        </div>
      )}

      {/* Filter Actions */}
      <div className="mt-4 flex justify-end space-x-2">
        <Button variant="ghost" onClick={handleReset}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
}
