import { Dialog, DialogContent } from "@/components/ui/dialog";
import { extractYouTubeId } from "@/utils/youtube";

interface VideoModalProps {
  videoUrl: string;
  isOpen: boolean;
  onClose: () => void;
}

export const VideoModal = ({ videoUrl, isOpen, onClose }: VideoModalProps) => {
  const videoId = extractYouTubeId(videoUrl);
  
  if (!videoId) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-0 bg-black">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
