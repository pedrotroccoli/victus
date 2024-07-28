import { content } from "./lib/content"
import { getDate, getDaysInMonth } from "date-fns";
import { cn } from "./lib/utils";
import { Button } from "./components/ui/button";
import { LogOut, PlusCircle } from "lucide-react";
import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react";

function App() {
  const { user, logout } =useAuth0();
  const daysInMonth = getDaysInMonth(new Date());
  const currentDay = getDate(new Date());

  return (
    <main className="max-w-screen-xl mx-auto border-x h-screen">
      <header className="border-b py-4 px-8">
        <div className="flex items-center justify-between">
            <div/>

            <div className="">
              <Button variant="outline" className="flex gap-2 rounded-xl h-8" onClick={() => logout()}>
                Sair
                <LogOut size={16} />
              </Button>
            </div>
        </div>
      </header>

    <div className="max-w-screen-lg mx-auto pt-16">
      <div className="flex items-center justify-between">
        <h1 className="font-sans text-xl font-medium">Olá {user?.name}, aqui está seu jornal!</h1>

        <Button className="flex gap-2 bg-black rounded-xl text-white">
          Adicionar
          <PlusCircle size={16} />
        </Button>
      </div>

      <div className="mt-8">
          <div className="flex flex-wrap mb-2">
            <div className="w-16" />

              {[...Array(daysInMonth)].map((_, index) => (
                <div className="w-7 h-7 flex items-end justify-center text-xs font-bold">
                  {index + 1}
                </div>
              ))}
            </div>
          <div>


          {content.map(item => (
            <div className="flex flex-wrap">
              <div className="flex items-center gap-4 w-16">
                <p className="text-xs font-bold">{item.name}</p>
              </div>

                <div className="flex flex-wrap">
                  {[...Array(daysInMonth)].map((_, index) => (
                    <button className={cn("w-7 h-7 flex items-end justify-center border hover:border-black", index === currentDay ? "border-x-black" : "")}>

                    </button>
                  ))}
                </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default withAuthenticationRequired(App);
