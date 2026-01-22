import { cn } from "@/lib/utils"
import { passwordLowerCaseValidator, passwordNumberValidator, passwordSpecialCharacterValidator, passwordUpperCaseValidator } from "@/utils/validators/password"
import { Check, X } from "lucide-react"
import { useTranslation } from "react-i18next"

type PasswordStrengthListProps = {
  password: string
  passwordConfirmation: string
} & React.HTMLAttributes<HTMLDivElement>

export function PasswordStrengthList({ password, passwordConfirmation, className }: PasswordStrengthListProps) {
  const { t } = useTranslation('auth')

  const list = (password: string) => [
    {
      key: 'passwords_match',
      text: t('sign_up.password_strength.tips.passwords_match'),
      condition: password !== '' && (password || '') === passwordConfirmation || '',
    },
    {
      key: 'has_number',
      text: t('sign_up.password_strength.tips.has_number'),
      condition: passwordNumberValidator(password),
    },
    {
      key: 'has_uppercase',
      text: t('sign_up.password_strength.tips.has_uppercase'),
      condition: passwordUpperCaseValidator(password),
    },
    {
      key: 'has_lowercase',
      text: t('sign_up.password_strength.tips.has_lowercase'),
      condition: passwordLowerCaseValidator(password),
    },
    {
      key: 'has_special',
      text: t('sign_up.password_strength.tips.has_special'),
      condition: passwordSpecialCharacterValidator(password),
    },
  ]

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {list(password).map((item) => (
        <li key={item.key} className='flex items-center gap-2'>
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
