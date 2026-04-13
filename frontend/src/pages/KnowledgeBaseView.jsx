import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../store/authStore";
import Navigation from "../components/common/Navigation";
import Button from "../components/common/Button";
import Card, { CardBody } from "../components/common/Card";
import Spinner from "../components/common/Spinner";
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

export default function KnowledgeBaseView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  const canEdit = user?.role === "ict_officer" || user?.role === "admin";

  const { data: article, isLoading, error } = useQuery({
    queryKey: ["knowledge-base", id],
    queryFn: () => knowledgeBaseService.getById(id),
    enabled: !!id && id !== "new",
  });

  if (isLoading) {
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

  if (error || !article) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 sm:px-0">
            <Card>
              <CardBody>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    Article not found or failed to load.
                  </p>
                  <Button variant="outline" onClick={() => navigate("/knowledge-base")}>
                    Back to Knowledge Base
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">
          <div className="mb-6">
            <Link
              to="/knowledge-base"
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
              Back to Knowledge Base
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {CATEGORY_LABELS[article.category] || article.category}
                  </span>
                  <span className="text-xs text-gray-500">
                    {article.views || 0} views
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{article.title}</h1>
                <p className="text-sm text-gray-500 mt-2">
                  By {article.author?.name || "Unknown"} on{" "}
                  {new Date(article.created_at).toLocaleDateString("en-KE", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              {canEdit && (
                <div className="flex gap-2">
                  <Link to={`/knowledge-base/${article.id}/edit`}>
                    <Button variant="outline" size="sm">
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <Card>
            <CardBody>
              <div
                className="prose prose-blue max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </CardBody>
          </Card>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Last updated:{" "}
              {new Date(article.updated_at).toLocaleDateString("en-KE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <Link to="/knowledge-base">
              <Button variant="ghost" size="sm">
                View More Articles
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}