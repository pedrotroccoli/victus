import { Pencil, PlusCircle, Question, Triangle } from "@phosphor-icons/react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface NewDelta {
  _id: string;
  name: string;
  type: 'number' | 'time';
}

interface DeltaTabProps {
  onEditDelta?: (deltaId: string) => void;
  onCreateDelta?: () => void;
  deltas?: HabitDelta[];
  newDeltas?: NewDelta[];
}

export function DeltaTab({ onEditDelta, onCreateDelta, deltas, newDeltas }: DeltaTabProps) {
  const { t } = useTranslation('habit', { keyPrefix: 'create_habit_modal' })

  const onClickCreateDelta = () => {
    onCreateDelta?.();
  }

  const onClickEdit = (item: NewDelta) => {
    onEditDelta?.(item._id);
  }

  const formattedDeltas = [...(deltas?.map((item) => ({
    ...item,
    type: 'active'
  })) || []), ...(newDeltas?.map((item) => ({
    ...item,
    type: 'new'
  })) || [])];

  return (
    <>
      <div className='px-4 relative'>
        <div className='flex justify-between items-center'>

          <div className='flex items-center gap-2'>
            <h3 className='font-bold font-[Recursive] flex items-center gap-2'>{t('deltas.title')}</h3>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Question size={18} className='text-neutral-700' weight='bold' />
                </TooltipTrigger>
                <TooltipContent className='max-w-[30rem] p-4'>
                  <p className='font-bold'>{t('deltas.tooltip.title')}</p>
                  <p className='text-black/70 mt-2 text-xs'>{t('deltas.tooltip.description')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <button onClick={onClickCreateDelta}>
            <PlusCircle size={28} weight='bold' className='text-black hover:bg-black hover:text-white rounded-full p-1' />
          </button>
        </div>
      </div>
      <div className='px-4 py-4'>
        <ul className='grid gap-4 overflow-y-auto max-h-[20rem] inset-shadow-lg rounded-lg'>
          {formattedDeltas?.map((item) => {
            return (
              <li key={item._id}>
                <div className={cn(
                  'w-full border border-neutral-300 rounded-lg flex h-full group relative',
                )}>
                  <div className='p-3'>
                    <Triangle size={18} weight='bold' className='mt-1' />
                  </div>
                  <div className='h-full w-px bg-neutral-300'></div>
                  <div className='flex flex-col p-3 gap-2'>
                    <div className='flex items-center gap-2'>
                      <h5 className='font-[Recursive] text-sm'>{t('deltas.blocks.status.label')}:</h5>
                      <p className='font-bold text-black/70 text-sm flex items-center gap-1'>
                        {item.type === 'active' ? t('deltas.blocks.status.options.active') : t('deltas.blocks.status.options.new')}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <h5 className='font-[Recursive] text-sm'>{t('deltas.blocks.name.label')}:</h5>
                      <p className='font-bold text-black/70 text-sm'>{item.name}</p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <h5 className='font-[Recursive] text-sm'>{t('deltas.blocks.type.label')}:</h5>
                      <p className='font-bold text-black/70 text-sm'>{t('deltas.blocks.type.options.number')}</p>
                    </div>
                  </div>
                  <div className="absolute right-3 top-3">
                    <button onClick={() => onClickEdit(item as NewDelta)}>
                      <Pencil size={18} weight='bold' className='text-black/70' />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
          <li>
            <button className='w-full border border-neutral-300 rounded-lg flex items-center justify-center border-dashed h-20 gap-2 hover:border-solid hover:border-black' onClick={onClickCreateDelta}>
              <p className='text-black/70 font-[Recursive]'>
                {deltas?.length === 0 ? t('deltas.empty.title') : t('deltas.empty.one_more')}
              </p>
              <PlusCircle size={18} weight='bold' className='text-black/70' />
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}