import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface MeetMarcCardProps {
  title: string;
  description: string;
  image_url: string;
  isEven: boolean;
}

export const MeetMarcCard = ({ title, description, image_url, isEven }: MeetMarcCardProps) => {
  const { elementRef, isVisible } = useScrollAnimation();

  return (
    <div 
      ref={elementRef}
      className={`scroll-fade-in ${isVisible ? 'visible' : ''} flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center`}
    >
      <div className="lg:w-1/2">
        <img 
          src={image_url} 
          alt={title} 
          className="w-full h-auto object-cover rounded sm:hidden" 
        />
        <img 
          src={image_url} 
          alt={title} 
          className="hidden sm:block w-full aspect-[16/9] object-cover rounded" 
        />
      </div>
      <div className="lg:w-1/2 space-y-6">
        <h4 className="subtitle text-brand-ink">{title}</h4>
        <p className="body-text text-brand-ink-sub leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
