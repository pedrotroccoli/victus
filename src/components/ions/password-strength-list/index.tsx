import { cn } from "@/lib/utils"
import { passwordLengthValidator, passwordLowerCaseValidator, passwordNumberValidator, passwordSpecialCharacterValidator, passwordUpperCaseValidator } from "@/utils/validators/password"
import { Check, X } from "lucide-react"

type PasswordStrengthListProps = {
  password: string
  passwordConfirmation: string
} & React.HTMLAttributes<HTMLDivElement>

export function PasswordStrengthList({ password, passwordConfirmation, className }: PasswordStrengthListProps) {
  const list = (password: string) => [
    {
      text: 'As senhas são iguais',
      condition: password === passwordConfirmation,
    },
    {
      text: 'Possui pelo menos 8 caracteres',
      condition: passwordLengthValidator(password),
    },
    {
      text: 'Possui pelo menos 1 número',
      condition: passwordNumberValidator(password),
    },
    {
      text: 'Possui pelo menos 1 letra maiúscula',
      condition: passwordUpperCaseValidator(password),
    },
    {
      text: 'Possui pelo menos 1 letra minúscula',
      condition: passwordLowerCaseValidator(password),
    },
    {
      text: 'Possui pelo menos 1 caractere especial',
      condition: passwordSpecialCharacterValidator(password),
    },
  ]

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {list(password).map((item) => (
        <li key={item.text} className='flex items-center gap-2'>
          <div className={
            cn(
              'w-5 h-5 border border-black rounded-full flex items-center justify-center',
              item.condition ? 'bg-green-800' : 'bg-white'
            )
          }>
            {item.condition && password.length > 0 && (
              <Check size={10} strokeWidth={3} className={cn(item.condition ? 'text-white' : 'text-black')} />
            )}
            {!item.condition && password.length > 0 && (
              <X size={10} strokeWidth={3} className='text-black' />
            )}
          </div>
          <p className='text-sm text-black/75'>{item.text}</p>
        </li>
      ))}
    </div>
  )
}
