import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Upload, Download } from "lucide-react";

export default function ImageBuilder() {
  const [image, setImage] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(128);
  const [invert, setInvert] = useState(false);
  const [blockCount, setBlockCount] = useState(0);
  const [gridData, setGridData] = useState<number[][]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        setImage(canvas.toDataURL());
        processImage(img.width, img.height, ctx);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const processImage = (width: number, height: number, ctx: CanvasRenderingContext2D) => {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const grid: number[][] = [];
    let count = 0;

    for (let y = 0; y < height; y++) {
      const row: number[] = [];
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        const a = data[idx + 3];

        // Calculate brightness
        const brightness = (r + g + b) / 3;
        const isDark = invert ? brightness < threshold : brightness > threshold;
        const isOpaque = a > 128;

        if (isDark && isOpaque) {
          row.push(1);
          count++;
        } else {
          row.push(0);
        }
      }
      grid.push(row);
    }

    setGridData(grid);
    setBlockCount(count);
    updatePreview(grid, width, height);
  };

  const updatePreview = (grid: number[][], width: number, height: number) => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        if (grid[y]?.[x] === 1) {
          data[idx] = 60;
          data[idx + 1] = 60;
          data[idx + 2] = 60;
          data[idx + 3] = 255;
        } else {
          data[idx] = 20;
          data[idx + 1] = 20;
          data[idx + 2] = 20;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const handleThresholdChange = (value: number[]) => {
    setThreshold(value[0]);
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) processImage(canvas.width, canvas.height, ctx);
    }
  };

  const handleInvertChange = (checked: boolean) => {
    setInvert(checked);
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) processImage(canvas.width, canvas.height, ctx);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Image Builder</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-card-foreground">Upload Image</h2>
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <label className="cursor-pointer block">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Click to upload or drag and drop</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {image && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="threshold" className="text-sm font-medium">
                    Darkness Threshold: {threshold}
                  </Label>
                  <Slider
                    id="threshold"
                    min={0}
                    max={255}
                    step={1}
                    value={[threshold]}
                    onValueChange={handleThresholdChange}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="invert"
                    checked={invert}
                    onCheckedChange={handleInvertChange}
                  />
                  <Label htmlFor="invert" className="text-sm font-medium cursor-pointer">
                    Invert Colors
                  </Label>
                </div>

                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{blockCount}</span> blocks to place
                  </p>
                </div>

                <Button className="w-full" size="lg">
                  <Download className="mr-2 h-4 w-4" />
                  Send to Bots
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Preview Section */}
        <Card className="p-6 bg-card border-border">
          <h2 className="text-lg font-semibold text-card-foreground mb-4">Preview</h2>
          <div className="bg-muted rounded-lg p-4 flex items-center justify-center min-h-[300px]">
            {image ? (
              <canvas
                ref={previewCanvasRef}
                className="max-w-full max-h-[400px] image-rendering-pixelated"
                style={{ imageRendering: "pixelated" }}
              />
            ) : (
              <p className="text-muted-foreground text-sm">Upload an image to see preview</p>
            )}
          </div>
        </Card>
      </div>

      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
