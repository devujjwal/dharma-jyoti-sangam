import { useCallback } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Share2, Link as LinkIcon, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface Props {
  title: string;
  url?: string;
  text?: string;
}

const ShareButton = ({ title, url, text }: Props) => {
  const { language } = useLanguage();
  const isHi = language === "hi";
  const shareUrl = url || window.location.href;

  const handleShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: text || title, url: shareUrl });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: isHi ? "लिंक कॉपी हो गया" : "Link copied",
        description: isHi ? "लिंक क्लिपबोर्ड पर कॉपी हो गया है" : "Link copied to clipboard",
      });
    }
  }, [title, text, shareUrl, isHi]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="font-devanagari gap-1.5"
    >
      <Share2 className="w-4 h-4" />
      {isHi ? "शेयर करें" : "Share"}
    </Button>
  );
};

export default ShareButton;
