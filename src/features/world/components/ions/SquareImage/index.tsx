import { cn } from "@/lib/utils";

interface SquareImageProps {
  image: string;
  alt: string;
}

export const SquareImage = ({ image, alt }: SquareImageProps) => {
  return (
    <div className="border border-neutral-300 rounded-lg h-80 max-w-[32rem]">
      <div className={cn("relative w-full h-full")}>
        <img src={image} alt={alt} className={cn("w-full h-full object-cover rounded-lg")} />
        <div className={
          cn(
            "absolute w-3/5 h-full top-0 left-[-125%] bg-white/30 skew-x-[45deg] backdrop-blur-lg",
          )
        } style={{
          transition: "500ms"
        }}></div>

        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/50 to-transparent rounded-lg">


        </div>
      </div>
    </div>
  )
}