import { useState } from "react";
import Input from "../common/Input";
import Select from "../common/Select";
import Button from "../common/Button";

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const categoryOptions = [
  { value: "hardware", label: "Hardware" },
  { value: "software", label: "Software" },
  { value: "network", label: "Network" },
  { value: "printer", label: "Printer" },
  { value: "email", label: "Email" },
  { value: "account", label: "Account" },
  { value: "other", label: "Other" },
];

export default function TicketForm({
  initialData = {},
  onSubmit,
  loading = false,
  isEdit = false,
}) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    priority: initialData.priority || "medium",
    category: initialData.category || "",
    location: initialData.location || "",
    contact_phone: initialData.contact_phone || "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length < 10) {
      newErrors.title = "Title must be at least 10 characters";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Brief summary of the issue"
        error={errors.title}
        required
      />

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description <span className="text-odpp-red">*</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={5}
          placeholder="Detailed description of the issue..."
          className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none sm:text-sm ${
            errors.description
              ? "border-red-300 focus:ring-red-500 focus:border-red-500"
              : "border-gray-300 focus:ring-odpp-blue focus:border-odpp-blue"
          }`}
          required
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          options={priorityOptions}
          required
        />

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categoryOptions}
          placeholder="Select a category"
          error={errors.category}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Office/Room number (optional)"
        />

        <Input
          label="Contact Phone"
          name="contact_phone"
          type="tel"
          value={formData.contact_phone}
          onChange={handleChange}
          placeholder="Phone number for contact (optional)"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={loading}>
          {isEdit ? "Update Ticket" : "Submit Ticket"}
        </Button>
      </div>
    </form>
  );
}
