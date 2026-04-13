import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import Navigation from "../components/common/Navigation";
import Button from "../components/common/Button";
import Card, { CardBody } from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import Input from "../components/common/Input";
import Select from "../components/common/Select";
import knowledgeBaseService from "../services/knowledgeBaseService";

const CATEGORY_LABELS = {
  hardware: "Hardware",
  software: "Software",
  network: "Network",
  printer: "Printer",
  email: "Email",
  account: "Account",
  other: "Other",
};

export default function KnowledgeBase() {
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const canEdit = user?.role === "ict_officer" || user?.role === "admin";

  const { data, isLoading, error } = useQuery({
    queryKey: ["knowledge-base", search, category, page],
    queryFn: () =>
      knowledgeBaseService.getAll({
        search: search || undefined,
        category: category || undefined,
        page,
      }),
  });

  const articles = data?.data || [];
  const pagination = {
    currentPage: data?.current_page || 1,
    totalPages: data?.last_page || 1,
    totalItems: data?.total || 0,
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
              <p className="text-gray-600 mt-1">
                Find solutions to common IT issues
              </p>
            </div>
            {canEdit && (
              <div className="mt-4 sm:mt-0">
                <Link to="/knowledge-base/new">
                  <Button variant="primary">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    New Article
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <Card className="mb-6">
            <CardBody>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-48">
                  <Select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      setPage(1);
                    }}
                    options={[
                      { value: "", label: "All Categories" },
                      ...Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
                        value,
                        label,
                      })),
                    ]}
                  />
                </div>
                <Button type="submit" variant="primary">
                  Search
                </Button>
              </form>
            </CardBody>
          </Card>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : error ? (
            <Card>
              <CardBody>
                <p className="text-red-600 text-center py-4">
                  Failed to load articles. Please try again.
                </p>
              </CardBody>
            </Card>
          ) : articles.length === 0 ? (
            <Card>
              <CardBody>
                <p className="text-gray-500 text-center py-8">
                  No articles found. {canEdit && "Create your first article!"}
                </p>
              </CardBody>
            </Card>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {articles.map((article) => (
                  <Card
                    key={article.id}
                    className="hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/knowledge-base/${article.id}`)}
                  >
                    <CardBody>
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {CATEGORY_LABELS[article.category] || article.category}
                            </span>
                            <span className="text-xs text-gray-500">
                              {article.views || 0} views
                            </span>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {article.content?.replace(/<[^>]*>/g, "").slice(0, 200)}...
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            By {article.author?.name || "Unknown"} on{" "}
                            {new Date(article.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="px-4 py-2 text-sm text-gray-600">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}