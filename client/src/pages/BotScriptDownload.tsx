import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function BotScriptDownload() {
  const [copiedVersion, setCopiedVersion] = useState<string | null>(null);

  const versions = [
    {
      version: "2.1.0",
      date: "2026-05-31",
      size: "45 KB",
      status: "latest",
      changes: ["Improved pathfinding", "Better collision detection", "Performance optimizations"],
    },
    {
      version: "2.0.5",
      date: "2026-05-28",
      size: "42 KB",
      status: "stable",
      changes: ["Bug fixes", "Stability improvements"],
    },
    {
      version: "2.0.0",
      date: "2026-05-20",
      size: "40 KB",
      status: "legacy",
      changes: ["Major release", "New architecture"],
    },
  ];

  const handleCopy = (version: string) => {
    navigator.clipboard.writeText(`npm install minecraft-bot-platform@${version}`);
    setCopiedVersion(version);
    setTimeout(() => setCopiedVersion(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Bot Script Download</h1>
      </div>

      {/* Quick Start */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Quick Start</h2>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Download the latest multi-bot manager script and follow the installation instructions below.
          </p>

          <div className="bg-muted p-4 rounded-lg font-mono text-sm text-foreground">
            <div className="flex items-center justify-between">
              <code>npm install minecraft-bot-platform@latest</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy("latest")}
              >
                {copiedVersion === "latest" ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Button className="w-full" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Download Latest Version (2.1.0)
          </Button>
        </div>
      </Card>

      {/* Version History */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">Version History</h2>
        {versions.map((v) => (
          <Card key={v.version} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-foreground">v{v.version}</h3>
                  <Badge
                    variant={v.status === "latest" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {v.status}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  Released {v.date} • {v.size}
                </p>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-muted-foreground">Changes:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {v.changes.map((change, idx) => (
                      <li key={idx}>• {change}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(v.version)}
                >
                  {copiedVersion === v.version ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Installation Instructions */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Installation Instructions</h2>
        <div className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground mb-2">1. Download the Script</p>
            <p>Click the download button above to get the latest multi-bot manager script.</p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-2">2. Install Dependencies</p>
            <div className="bg-muted p-3 rounded font-mono text-xs text-foreground">
              npm install
            </div>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-2">3. Configure Server Settings</p>
            <p>Update the server host, port, and bot usernames in the Server Configuration panel.</p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-2">4. Run the Bot Manager</p>
            <div className="bg-muted p-3 rounded font-mono text-xs text-foreground">
              node master_builder_pro.js
            </div>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-2">5. Upload an Image</p>
            <p>Go to the Image Builder page and upload your logo or structure image.</p>
          </div>

          <div>
            <p className="font-semibold text-foreground mb-2">6. Start Building</p>
            <p>Set the origin coordinates and click "Send to Bots" to start the build.</p>
          </div>
        </div>
      </Card>

      {/* Support */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Support & Documentation</h2>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            📖 View Full Documentation
          </Button>
          <Button variant="outline" className="w-full justify-start">
            🐛 Report a Bug
          </Button>
          <Button variant="outline" className="w-full justify-start">
            💬 Join Community Discord
          </Button>
        </div>
      </Card>
    </div>
  );
}
