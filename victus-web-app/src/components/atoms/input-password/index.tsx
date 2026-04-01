import { Input, InputProps } from "@/components/atoms/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export interface InputPasswordProps extends Omit<InputProps, "iconRight"> { }

export const InputPassword = (props: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      {...props}
      type={showPassword ? "text" : "password"}
      iconRight={
        <button
          className="w-5 h-5 rounded-md flex items-center justify-center hover:bg-neutral-200 duration-200 transition-colors"
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
        >
          {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      }
    />
  )
}
