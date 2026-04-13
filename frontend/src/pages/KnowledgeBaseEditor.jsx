import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "../components/common/Navigation";
import Button from "../components/common/Button";
import Card, { CardBody } from "../components/common/Card";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import Textarea from "../components/common/Textarea";
import Spinner from "../components/common/Spinner";
import knowledgeBaseService from "../services/knowledgeBaseService";

const CATEGORIES = [
  { value: "hardware", label: "Hardware" },
  { value: "software", label: "Software" },
  { value: "network", label: "Network" },
  { value: "printer", label: "Printer" },
  { value: "email", label: "Email" },
  { value: "account", label: "Account" },
  { value: "other", label: "Other" },
];

export default function KnowledgeBaseEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = id && id !== "new";

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
    is_published: true,
  });
  const [errors, setErrors] = useState({});

  const { data: article, isLoading: loadingArticle } = useQuery({
    queryKey: ["knowledge-base", id],
    queryFn: () => knowledgeBaseService.getById(id),
    enabled: isEditing,
  });

  const createMutation = useMutation({
    mutationFn: (data) => knowledgeBaseService.create(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["knowledge-base"]);
      navigate(`/knowledge-base/${data.id}`);
    },
    onError: (error) => {
      setErrors({ submit: error.response?.data?.message || "Failed to create article" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => knowledgeBaseService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["knowledge-base"]);
      navigate(`/knowledge-base/${id}`);
    },
    onError: (error) => {
      setErrors({ submit: error.response?.data?.message || "Failed to update article" });
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    }
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (isEditing) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isEditing && loadingArticle) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  const displayData = article || formData;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <div className="mb-6">
            <Link
              to={isEditing ? `/knowledge-base/${id}` : "/knowledge-base"}
              className="text-odpp-blue hover:text-odpp-blue-dark flex items-center gap-1 text-sm mb-4"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              {isEditing ? "Back to Article" : "Back to Knowledge Base"}
            </Link>

            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Article" : "New Article"}
            </h1>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="mb-6">
              <CardBody className="space-y-4">
                <div>
                  <Input
                    label="Title"
                    name="title"
                    value={displayData.title}
                    onChange={handleChange}
                    error={errors.title}
                    placeholder="Enter article title"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Select
                      label="Category"
                      name="category"
                      value={displayData.category}
                      onChange={handleChange}
                      options={[{ value: "", label: "Select a category" }, ...CATEGORIES]}
                      error={errors.category}
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_published"
                        checked={displayData.is_published}
                        onChange={handleChange}
                        className="w-4 h-4 text-odpp-blue border-gray-300 rounded focus:ring-odpp-blue"
                      />
                      <span className="text-sm text-gray-700">Published</span>
                    </label>
                  </div>
                </div>

                <div>
                  <Textarea
                    label="Content"
                    name="content"
                    value={displayData.content}
                    onChange={handleChange}
                    error={errors.content}
                    rows={15}
                    placeholder="Write your article content here. HTML is supported."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    You can use HTML tags for formatting (e.g., &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;)
                  </p>
                </div>

                {errors.submit && (
                  <div className="text-red-600 text-sm">{errors.submit}</div>
                )}
              </CardBody>
            </Card>

            <div className="flex justify-end gap-3">
              <Link to={isEditing ? `/knowledge-base/${id}` : "/knowledge-base"}>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Spinner size="sm" />
                    Saving...
                  </span>
                ) : isEditing ? (
                  "Update Article"
                ) : (
                  "Create Article"
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}