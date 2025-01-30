import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface AccountAvatarProps {
  shortname: string;
  signOut: () => void;
}

export const AccountAvatar = ({ shortname, signOut }: AccountAvatarProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="cursor-pointer border hover:border-black duration-200 transition-colors">
          <AvatarImage src={undefined} />
          <AvatarFallback>
            {shortname}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className="h-auto">
          <Button variant="ghost" className="w-full justify-start py-1 cursor-pointer" onClick={signOut}>
            Sair
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}