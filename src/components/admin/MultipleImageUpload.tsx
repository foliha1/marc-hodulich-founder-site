import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { getImageDimensions } from "@/utils/imageOptimization";

interface MultipleImageUploadProps {
  folder: string;
  label: string;
  onUploadComplete: (data: Array<{ url: string; width: number; height: number }>) => void;
}

export const MultipleImageUpload = ({
  folder,
  label,
  onUploadComplete,
}: MultipleImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      throw new Error(`${file.name}: Invalid file type. Please upload an image.`);
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error(`${file.name}: File size must be less than 5MB.`);
    }
  };

  const uploadFile = async (file: File, index: number): Promise<{ url: string; width: number; height: number }> => {
    validateFile(file);

    // Extract dimensions first
    const dimensions = await getImageDimensions(file);

    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

    const { error: uploadError } = await supabase.storage
      .from("cms-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    setUploadProgress((prev) => ({ ...prev, [file.name]: 100 }));

    const { data: { publicUrl } } = supabase.storage
      .from("cms-images")
      .getPublicUrl(filePath);

    return { url: publicUrl, ...dimensions };
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadResults: Array<{ url: string; width: number; height: number }> = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const result = await uploadFile(files[i], i);
        uploadResults.push(result);
      }

      toast({
        title: "Success",
        description: `${files.length} image(s) uploaded successfully`,
      });

      onUploadComplete(uploadResults);
      setUploadProgress({});
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const progressEntries = Object.entries(uploadProgress);

  return (
    <div className="space-y-4">
      <Label>{label}</Label>
      
      {progressEntries.length > 0 && (
        <div className="space-y-2">
          {progressEntries.map(([fileName, progress]) => (
            <div key={fileName} className="space-y-1">
              <div className="text-sm text-muted-foreground">{fileName}</div>
              <Progress value={progress} className="h-2" />
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="w-full"
      >
        <Upload className="w-4 h-4 mr-2" />
        {uploading ? "Uploading..." : "Upload Multiple Images"}
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
