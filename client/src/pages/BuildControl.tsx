import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, RotateCcw, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

function SendToBotsButton({ originX, originY, originZ, onSuccess }: { originX: number; originY: number; originZ: number; onSuccess: () => void }) {
  const mockGrid = Array(10).fill(null).map(() => Array(10).fill(1));
  const totalBlocks = 100;
  
  const sendMutation = trpc.builds.sendToBots.useMutation({
    onSuccess: () => {
      toast.success("Build sent to bots!");
      onSuccess();
    },
    onError: (error) => {
      toast.error(`Error: ${error.message}`);
    },
  });
  
  return (
    <Button
      className="flex-1"
      size="lg"
      onClick={() => sendMutation.mutate({ grid: mockGrid, originX, originY, originZ, blockCount: totalBlocks })}
      disabled={sendMutation.isPending}
    >
      <Play className="mr-2 h-4 w-4" />
      {sendMutation.isPending ? "Sending..." : "Send to Bots"}
    </Button>
  );
}

export default function BuildControl() {
  const [originX, setOriginX] = useState(0);
  const [originY, setOriginY] = useState(0);
  const [originZ, setOriginZ] = useState(0);
  const [isBuilding, setIsBuilding] = useState(false);
  const [progress, setProgress] = useState(45);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Build Control</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Origin Coordinates */}
        <Card className="p-6 bg-card border-border lg:col-span-1">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Origin Coordinates</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="originX" className="text-sm font-medium">X</Label>
              <Input
                id="originX"
                type="number"
                value={originX}
                onChange={(e) => setOriginX(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="originY" className="text-sm font-medium">Y</Label>
              <Input
                id="originY"
                type="number"
                value={originY}
                onChange={(e) => setOriginY(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="originZ" className="text-sm font-medium">Z</Label>
              <Input
                id="originZ"
                type="number"
                value={originZ}
                onChange={(e) => setOriginZ(parseInt(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            <div className="flex gap-2 pt-4">
              <SendToBotsButton originX={originX} originY={originY} originZ={originZ} onSuccess={() => setIsBuilding(true)} />
              <Button
                variant="outline"
                size="lg"
                onClick={() => setProgress(0)}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded flex gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-yellow-700">Make sure <code className="bg-yellow-500/20 px-1 rounded">master_builder_pro.js</code> is running on your computer</p>
            </div>
          </div>
        </Card>

        {/* Build Progress */}
        <Card className="p-6 bg-card border-border lg:col-span-2">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Build Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Total Blocks</p>
                <p className="text-2xl font-bold text-foreground">2,847</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Placed</p>
                <p className="text-2xl font-bold text-green-500">1,281</p>
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-xs text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-amber-500">1,566</p>
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <p className="text-sm font-medium text-foreground">Bot Progress</p>
              <div className="space-y-2">
                {["Bot 1", "Bot 2", "Bot 3"].map((bot, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{bot}</span>
                    <div className="flex-1 mx-3 bg-muted rounded-full h-1.5">
                      <div
                        className="bg-primary h-1.5 rounded-full"
                        style={{ width: `${(idx + 1) * 20}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">{(idx + 1) * 20}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Estimated Time */}
      <Card className="p-6 bg-card border-border">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Blocks/Second</p>
            <p className="text-2xl font-bold text-foreground">12.5</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Elapsed Time</p>
            <p className="text-2xl font-bold text-foreground">1h 42m</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Estimated Remaining</p>
            <p className="text-2xl font-bold text-foreground">2h 5m</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
