import { Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function DashboardTabs() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Program Interactions Overview */}
      <Card className="bg-black border border-gray-800 shadow-xl">
        <CardHeader className="border-b border-gray-800">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg">
              <Settings className="w-5 h-5 text-amber-400" />
            </div>
            Program Interactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Overview of program interactions and settings.</p>
        </CardContent>
      </Card>

      {/* System Health Monitoring */}
      <Card className="bg-black border border-gray-800 shadow-xl">
        <CardHeader className="border-b border-gray-800">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Settings className="w-5 h-5 text-blue-400" />
            </div>
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Monitor system health and performance metrics.</p>
        </CardContent>
      </Card>

      {/* User Activity Tracking */}
      <Card className="bg-black border border-gray-800 shadow-xl">
        <CardHeader className="border-b border-gray-800">
          <CardTitle className="text-white flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Settings className="w-5 h-5 text-green-400" />
            </div>
            User Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Track user activity and engagement within the system.</p>
        </CardContent>
      </Card>
    </div>
  )
}
