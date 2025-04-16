import { ExclamationMark, Pencil, PlusCircle, Question, Triangle, Warning } from "@phosphor-icons/react";

import { TextField } from "@/components/molecules/form";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { FieldError, useFieldArray, useFormContext } from "react-hook-form";
import { isInAEditingState } from "./utils";

interface Delta {
  state: 'draft' | 'active' | 'edit';
  name: string;
  type: string;
}

export function DeltaTab() {
  const form = useFormContext<{
    deltas: Delta[];
  }>();

  const { fields, append } = useFieldArray({
    control: form.control,
    name: 'deltas',
  });
  const deltasContainerRef = useRef<HTMLUListElement>(null);
  const [draftWarningAnimation, setDraftWarningAnimation] = useState(false);
  const [draftWarning, setDraftWarning] = useState(false);

  const onClickCreateDelta = () => {
    if (fields.find(item => item.state === 'draft')) {
      setDraftWarning(true);
      setDraftWarningAnimation(true);

      setTimeout(() => {
        setDraftWarningAnimation(false);
      }, 1500);

      return;
    }

    append({
      state: 'draft',
      name: '',
      type: 'number',
    });

    if (deltasContainerRef.current) {
      setTimeout(() => {
        deltasContainerRef.current?.scrollTo({
          top: deltasContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }, 50);
    }
  }

  const deltas = form.watch('deltas');

  return (
    <>
      <div className='px-4 relative'>
        <div className='flex justify-between items-center'>

          <div className='flex items-center gap-2'>
            <h3 className='font-bold font-[Recursive] flex items-center gap-2'>Gerencie seus deltas</h3>
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Question size={18} className='text-neutral-700' weight='bold' />
                </TooltipTrigger>
                <TooltipContent className='max-w-[30rem] p-4'>
                  <p className='font-bold'>O que é um delta?</p>
                  <p className='text-black/70 mt-2 text-xs'>Um delta é uma quantidade que você completou do hábito. <br /> <br />Por exemplo, se você bebeu 2 litros de água em um dia o seu delta será 2 ou 2000 se preferir em mililitros.
                    <br /> <br />
                    Você tem total liberdade para usar os deltas como quiser.
                  </p>

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
        <ul className='grid gap-4 overflow-y-auto max-h-[20rem] inset-shadow-lg rounded-lg' ref={deltasContainerRef}>
          {deltas?.map((item, index) => {
            const errors = form.formState.errors as { deltas: { [key: string]: { state: FieldError } } };
            const hasDeltaStateError = errors?.deltas?.[index]?.state;
            const hasAndEditingState = isInAEditingState(item.state);
            const stateKey = `deltas.${index}.state` as const;

            return (
              <li>
                <div className={cn(
                  'w-full border border-neutral-300 rounded-lg flex h-full group relative',
                  draftWarningAnimation && item.state === 'draft' && 'border-yellow-500 animate-pulse-border-yellow shadow-md shadow-yellow-500/50'
                )}>
                  {draftWarning && item.state === 'draft' && (
                    <div className='absolute right-3 top-3 '>
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <div className='bg-yellow-400 rounded-full w-3.5 h-3.5 relative'>
                              <ExclamationMark size={10} weight='bold' className='text-black absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' />
                              <div className='size-full bg-yellow-400 rounded-full animate-ping'>

                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className='max-w-40 bg-yellow-400 border border-black rounded-lg p-2'>
                            <p className='text-xs text-black/70 max-w-40'>Delta em rascunho, conclua para adicionar outro.</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                  <div className='p-3'>
                    <Triangle size={18} weight='bold' className='mt-1' />
                  </div>
                  <div className='h-full w-px bg-neutral-300'></div>
                  <div className='flex flex-col p-3 gap-2'>
                    <div className='flex items-center gap-2'>
                      <h5 className='font-[Recursive] text-sm'>Status:</h5>
                      <p className='font-bold text-black/70 text-sm flex items-center gap-1'>
                        {item.state === 'draft' ? 'Rascunho' : 'Ativo'}
                        {hasDeltaStateError && (
                          <Warning size={16} weight='bold' className='fill-red-500' />
                        )}
                      </p>
                    </div>
                    <div className='flex items-center gap-2'>
                      <h5 className='font-[Recursive] text-sm'>Nome:</h5>
                      {hasAndEditingState ? (
                        <TextField name={`deltas.${index}.name`} placeholder='Ex: Quantidade de água' className='h-6' />
                      ) : (
                        <p className='font-bold text-black/70 text-sm'>{item.name}</p>
                      )}
                    </div>
                    <div className='flex items-center gap-2'>
                      <h5 className='font-[Recursive] text-sm'>Tipo:</h5>
                      <p className='font-bold text-black/70 text-sm'>Número</p>
                    </div>
                  </div>
                  <div className="absolute right-3 top-3">
                    {!hasAndEditingState && (
                      <button onClick={() => {
                        form.setValue(`deltas.${index}.state`, 'edit');
                      }}>
                        <Pencil size={18} weight='bold' className='text-black/70' />
                      </button>
                    )}
                  </div>
                  {hasAndEditingState && (
                    <div className='absolute right-3 bottom-3 flex gap-2'>
                      <Button size='sm' variant={'outline'} className='rounded-lg px-2 py-1 flex w-auto h-auto' onClick={() => {
                        form.setValue(stateKey, 'draft');
                      }}>
                        Cancelar
                      </Button>
                      <Button size='sm' className={
                        cn(
                          'rounded-lg px-2 py-1 flex w-auto h-auto',
                          hasDeltaStateError && 'bg-green-500 hover:bg-green-500/80'
                        )
                      } onClick={async () => {
                        const isValid = await form.trigger(`deltas.${index}.name`);

                        if (isValid) {
                          form.setValue(stateKey, 'active');
                          form.clearErrors(stateKey);
                        }
                      }}>
                        Salvar
                      </Button>
                    </div>
                  )}
                </div>
              </li>
            )
          })}
          <li>
            <button className='w-full border border-neutral-300 rounded-lg flex items-center justify-center border-dashed h-20 gap-2 hover:border-solid hover:border-black' onClick={onClickCreateDelta}>

              <p className='text-black/70 font-[Recursive]'>
                {fields.length === 0 ? 'Crie seu primeiro delta' : 'Criar um novo delta'}
              </p>
              <PlusCircle size={18} weight='bold' className='text-black/70' />
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}