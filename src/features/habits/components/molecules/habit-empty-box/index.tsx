import { useDroppable } from "@dnd-kit/core";

export const HabitEmptyBox = ({ id }: { id: string }) => {
  const { setNodeRef } = useDroppable({
    id,
    data: {
      type: 'empty-box',
    }
  });

  return (
    <div ref={setNodeRef}>
      <div className="flex items-center justify-center w-full h-full border border-dashed border-neutral-500 rounded-md p-2 hover:border-black hover:border-solid transition-colors duration-200">
        <p className="text-xs text-neutral-500">Vazio {process.env.NODE_ENV === 'development' && id}</p>
      </div>
    </div>
  )
}