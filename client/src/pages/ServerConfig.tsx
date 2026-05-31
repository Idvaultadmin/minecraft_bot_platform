import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle } from "lucide-react";

export default function ServerConfig() {
  const [host, setHost] = useState("etu6retrdx.aternos.me");
  const [port, setPort] = useState(61824);
  const [botUsernames, setBotUsernames] = useState(["q", "q2", "q3"]);
  const [whitelist, setWhitelist] = useState(["q33a"]);
  const [newBot, setNewBot] = useState("");
  const [newWhitelist, setNewWhitelist] = useState("");
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle");

  const handleAddBot = () => {
    if (newBot && !botUsernames.includes(newBot)) {
      setBotUsernames([...botUsernames, newBot]);
      setNewBot("");
    }
  };

  const handleRemoveBot = (bot: string) => {
    setBotUsernames(botUsernames.filter((b) => b !== bot));
  };

  const handleAddWhitelist = () => {
    if (newWhitelist && !whitelist.includes(newWhitelist)) {
      setWhitelist([...whitelist, newWhitelist]);
      setNewWhitelist("");
    }
  };

  const handleRemoveWhitelist = (user: string) => {
    setWhitelist(whitelist.filter((u) => u !== user));
  };

  const handleTestConnection = async () => {
    setConnectionStatus("testing");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setConnectionStatus("success");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Server Configuration</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Connection */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Server Connection</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="host" className="text-sm font-medium">
                Server Host
              </Label>
              <Input
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                className="mt-1"
                placeholder="example.com"
              />
            </div>

            <div>
              <Label htmlFor="port" className="text-sm font-medium">
                Port
              </Label>
              <Input
                id="port"
                type="number"
                value={port}
                onChange={(e) => setPort(parseInt(e.target.value) || 25565)}
                className="mt-1"
              />
            </div>

            <Button
              className="w-full"
              onClick={handleTestConnection}
              disabled={connectionStatus === "testing"}
            >
              {connectionStatus === "testing" && "Testing..."}
              {connectionStatus === "success" && (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Connected
                </>
              )}
              {connectionStatus === "error" && (
                <>
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Connection Failed
                </>
              )}
              {connectionStatus === "idle" && "Test Connection"}
            </Button>
          </div>
        </Card>

        {/* Bot Usernames */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Bot Usernames</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newBot}
                onChange={(e) => setNewBot(e.target.value)}
                placeholder="Enter bot username"
                onKeyPress={(e) => e.key === "Enter" && handleAddBot()}
              />
              <Button onClick={handleAddBot} variant="outline">
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {botUsernames.map((bot) => (
                <Badge key={bot} variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-destructive/20">
                  {bot}
                  <button
                    onClick={() => handleRemoveBot(bot)}
                    className="ml-2 text-xs hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Whitelist */}
      <Card className="p-6 bg-card border-border">
        <h2 className="text-lg font-semibold text-card-foreground mb-4">Command Whitelist</h2>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Only these players can control the bots via chat commands
          </p>

          <div className="flex gap-2">
            <Input
              value={newWhitelist}
              onChange={(e) => setNewWhitelist(e.target.value)}
              placeholder="Enter player username"
              onKeyPress={(e) => e.key === "Enter" && handleAddWhitelist()}
            />
            <Button onClick={handleAddWhitelist} variant="outline">
              Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {whitelist.map((user) => (
              <Badge key={user} variant="outline" className="px-3 py-1 cursor-pointer hover:bg-destructive/20">
                {user}
                <button
                  onClick={() => handleRemoveWhitelist(user)}
                  className="ml-2 text-xs hover:text-destructive"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex gap-3">
        <Button className="flex-1" size="lg">
          Save Configuration
        </Button>
        <Button variant="outline" size="lg">
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
