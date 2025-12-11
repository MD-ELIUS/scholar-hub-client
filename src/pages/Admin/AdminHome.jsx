import { Card, CardContent } from "@/components/ui/card";
import { BarChart } from "@/components/charts/BarChart";

export default function AdminHome() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {/* Stats Cards */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm text-gray-500">Total Users</h2>
          <p className="text-3xl font-bold mt-2">1,280</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm text-gray-500">Total Scholarships</h2>
          <p className="text-3xl font-bold mt-2">320</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm text-gray-500">Total Fees Collected</h2>
          <p className="text-3xl font-bold mt-2">$52,400</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h2 className="text-sm text-gray-500">Active Applications</h2>
          <p className="text-3xl font-bold mt-2">890</p>
        </CardContent>
      </Card>

      {/* Chart */}
      <div className="col-span-1 xl:col-span-4 mt-6 bg-white p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-3">Applications by Category</h2>
        <BarChart />
      </div>
    </div>
  );
}
