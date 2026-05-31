import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, RotateCcw } from "lucide-react";

export default function BuildHistory() {
  const builds = [
    {
      id: 1,
      name: "Logo v3",
      timestamp: "2026-05-31 18:30",
      blocks: 2847,
      status: "completed",
      blocksPlaced: 2847,
    },
    {
      id: 2,
      name: "Logo v2",
      timestamp: "2026-05-31 16:15",
      blocks: 1920,
      status: "completed",
      blocksPlaced: 1920,
    },
    {
      id: 3,
      name: "Test Build",
      timestamp: "2026-05-31 14:45",
      blocks: 512,
      status: "in_progress",
      blocksPlaced: 380,
    },
    {
      id: 4,
      name: "Logo v1",
      timestamp: "2026-05-31 12:20",
      blocks: 3200,
      status: "failed",
      blocksPlaced: 1500,
    },
  ];

  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    if (status === "in_progress") return <Clock className="h-4 w-4 text-blue-500" />;
    return <AlertCircle className="h-4 w-4 text-red-500" />;
  };

  const getStatusColor = (status: string) => {
    if (status === "completed") return "bg-green-500/10 text-green-700";
    if (status === "in_progress") return "bg-blue-500/10 text-blue-700";
    return "bg-red-500/10 text-red-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Build History</h1>
        <Badge variant="outline" className="text-sm">
          {builds.length} Builds
        </Badge>
      </div>

      <div className="space-y-3">
        {builds.map((build) => (
          <Card key={build.id} className="p-4 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center gap-2">
                  {getStatusIcon(build.status)}
                  <Badge className={`${getStatusColor(build.status)} border-0`}>
                    {build.status.replace("_", " ")}
                  </Badge>
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{build.name}</h3>
                  <p className="text-sm text-muted-foreground">{build.timestamp}</p>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Blocks</p>
                    <p className="text-lg font-bold text-foreground">{build.blocks}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Placed</p>
                    <p className="text-lg font-bold text-green-500">{build.blocksPlaced}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Progress</p>
                    <p className="text-lg font-bold text-foreground">
                      {Math.round((build.blocksPlaced / build.blocks) * 100)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {build.status === "in_progress" && (
                  <Button variant="outline" size="sm">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Statistics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Builds</p>
            <p className="text-3xl font-bold text-foreground">4</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-3xl font-bold text-green-500">2</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-3xl font-bold text-blue-500">1</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Failed</p>
            <p className="text-3xl font-bold text-red-500">1</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
