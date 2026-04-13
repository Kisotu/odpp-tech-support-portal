import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "../components/common/Navigation";
import Button from "../components/common/Button";
import Card, { CardHeader, CardTitle, CardBody } from "../components/common/Card";
import Spinner from "../components/common/Spinner";
import reportService from "../services/reportService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const COLORS = ["#1E3A8A", "#059669", "#D97706", "#DC2626", "#7C3AED", "#0891B2"];

export default function Reports() {
  const [dateRange, setDateRange] = useState("30");

  const { data: resolutionData, isLoading: resolutionLoading } = useQuery({
    queryKey: ["reports-resolution-times", dateRange],
    queryFn: () =>
      reportService.getResolutionTimes({
        start_date: getDateStart(dateRange),
        end_date: new Date().toISOString(),
      }),
  });

  const { data: categoryData, isLoading: categoryLoading } = useQuery({
    queryKey: ["reports-by-category", dateRange],
    queryFn: () =>
      reportService.getByCategory({
        start_date: getDateStart(dateRange),
        end_date: new Date().toISOString(),
      }),
  });

  const { data: slaData, isLoading: slaLoading } = useQuery({
    queryKey: ["reports-sla-compliance", dateRange],
    queryFn: () =>
      reportService.getSlaCompliance({
        start_date: getDateStart(dateRange),
        end_date: new Date().toISOString(),
      }),
  });

  function getDateStart(days) {
    const date = new Date();
    date.setDate(date.getDate() - parseInt(days));
    return date.toISOString();
  }

  const handleExportCsv = async () => {
    try {
      const blob = await reportService.exportCsv("tickets");
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `tickets_export_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const resolutionChartData =
    resolutionData?.by_category?.map((item) => ({
      category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
      avgHours: parseFloat(item.avg_hours?.toFixed(1) || 0),
      tickets: item.ticket_count,
    })) || [];

  const categoryChartData =
    categoryData?.by_category?.map((item) => ({
      name: item.category.charAt(0).toUpperCase() + item.category.slice(1),
      new: item.new_count,
      inProgress: item.in_progress_count,
      resolved: item.resolved_count,
      closed: item.closed_count,
    })) || [];

  const slaChartData = Object.entries(slaData?.compliance || {}).map(
    ([priority, data]) => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      complianceRate: data.compliance_rate || 0,
      total: data.total || 0,
    })
  );

  const slaPieData =
    slaData?.compliance
      ? Object.entries(slaData.compliance)
          .filter(([, d]) => d.total > 0)
          .map(([priority, data]) => ({
            name: priority.charAt(0).toUpperCase() + priority.slice(1),
            value: data.total,
            met: data.met,
            breached: data.breached,
          }))
      : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600 mt-1">
                Track performance metrics and ticket trends
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-odpp-blue"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
              <Button variant="outline" onClick={handleExportCsv}>
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
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Export CSV
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardBody>
                <div className="text-sm font-medium text-gray-500">
                  Overall Resolution Time
                </div>
                <div className="text-3xl font-bold text-odpp-blue mt-2">
                  {resolutionData?.overall_avg_hours || 0}
                  <span className="text-lg font-normal text-gray-500 ml-1">hrs</span>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="text-sm font-medium text-gray-500">SLA Compliance Rate</div>
                <div className="text-3xl font-bold text-green-600 mt-2">
                  {slaData?.overall_compliance_rate || 100}
                  <span className="text-lg font-normal text-gray-500 ml-1">%</span>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="text-sm font-medium text-gray-500">Total Tickets</div>
                <div className="text-3xl font-bold text-gray-700 mt-2">
                  {categoryData?.by_category?.reduce((sum, c) => sum + c.total, 0) || 0}
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Resolution Time by Category</CardTitle>
              </CardHeader>
              <CardBody>
                {resolutionLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="md" />
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={resolutionChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
                        <Tooltip
                          formatter={(value, name) => [
                            name === "avgHours" ? `${value} hrs` : value,
                            name === "avgHours" ? "Avg Resolution" : "Tickets",
                          ]}
                        />
                        <Bar dataKey="avgHours" fill="#1E3A8A" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ticket Status by Category</CardTitle>
              </CardHeader>
              <CardBody>
                {categoryLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="md" />
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="new" stackId="a" fill="#3B82F6" name="New" />
                        <Bar dataKey="inProgress" stackId="a" fill="#F59E0B" name="In Progress" />
                        <Bar dataKey="resolved" stackId="a" fill="#10B981" name="Resolved" />
                        <Bar dataKey="closed" stackId="a" fill="#6B7280" name="Closed" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>SLA Compliance by Priority</CardTitle>
              </CardHeader>
              <CardBody>
                {slaLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="md" />
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={slaChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
                        <Tooltip formatter={(value) => [`${value}%`, "Compliance"]} />
                        <Line
                          type="monotone"
                          dataKey="complianceRate"
                          stroke="#059669"
                          strokeWidth={2}
                          dot={{ fill: "#059669" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ticket Distribution by Priority</CardTitle>
              </CardHeader>
              <CardBody>
                {slaLoading ? (
                  <div className="flex justify-center py-8">
                    <Spinner size="md" />
                  </div>
                ) : slaPieData.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No data available</p>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={slaPieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {slaPieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>SLA Compliance Details</CardTitle>
            </CardHeader>
            <CardBody>
              {slaLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner size="md" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Priority
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          SLA Target
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Met
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Breached
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Compliance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(slaData?.compliance || {}).map(
                        ([priority, data]) => (
                          <tr key={priority}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="capitalize">{priority}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {data.sla_target_hours || 0} hours
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {data.total || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-green-600">
                              {data.met || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-red-600">
                              {data.breached || 0}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`font-semibold ${
                                  (data.compliance_rate || 0) >= 80
                                    ? "text-green-600"
                                    : (data.compliance_rate || 0) >= 50
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }`}
                              >
                                {data.compliance_rate || 0}%
                              </span>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </main>
    </div>
  );
}