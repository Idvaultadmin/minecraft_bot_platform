import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, CheckCircle2 } from "lucide-react";

export default function BotStatus() {
  const bots = [
    {
      name: "Bot 1",
      status: "online",
      currentTask: "Placing block at 100, 50, 200",
      blocksPlaced: 450,
      obsidian: 1200,
      position: { x: 100, y: 64, z: 200 },
    },
    {
      name: "Bot 2",
      status: "online",
      currentTask: "Moving to 150, 50, 200",
      blocksPlaced: 380,
      obsidian: 1500,
      position: { x: 145, y: 64, z: 195 },
    },
    {
      name: "Bot 3",
      status: "offline",
      currentTask: "Waiting for connection",
      blocksPlaced: 0,
      obsidian: 0,
      position: null,
    },
  ];

  const getStatusIcon = (status: string) => {
    if (status === "online") return <Activity className="h-4 w-4 text-green-500" />;
    if (status === "error") return <AlertCircle className="h-4 w-4 text-red-500" />;
    return <CheckCircle2 className="h-4 w-4 text-gray-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Bot Status</h1>
        <Badge variant="outline" className="text-sm">
          3 Bots Connected
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bots.map((bot, idx) => (
          <Card key={idx} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-card-foreground">{bot.name}</h2>
                <div className="flex items-center gap-2">
                  {getStatusIcon(bot.status)}
                  <Badge
                    variant={bot.status === "online" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {bot.status}
                  </Badge>
                </div>
              </div>

              {/* Current Task */}
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Current Task</p>
                <p className="text-sm text-foreground truncate">{bot.currentTask}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Blocks Placed</p>
                  <p className="text-lg font-bold text-green-500">{bot.blocksPlaced}</p>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Obsidian</p>
                  <p className="text-lg font-bold text-blue-500">{bot.obsidian}</p>
                </div>
              </div>

              {/* Position */}
              {bot.position ? (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Position</p>
                  <p className="text-sm font-mono text-foreground">
                    {bot.position.x}, {bot.position.y}, {bot.position.z}
                  </p>
                </div>
              ) : (
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">Position</p>
                  <p className="text-sm text-muted-foreground">Offline</p>
                </div>
              )}

              {/* Last Update */}
              <p className="text-xs text-muted-foreground">Updated 2 seconds ago</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Summary Stats */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Online Bots</p>
            <p className="text-3xl font-bold text-green-500">2</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Blocks Placed</p>
            <p className="text-3xl font-bold text-foreground">830</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Obsidian</p>
            <p className="text-3xl font-bold text-blue-500">2,700</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg Blocks/Min</p>
            <p className="text-3xl font-bold text-foreground">15.2</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
