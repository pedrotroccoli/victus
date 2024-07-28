import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Indie_Flower } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

// https://coolors.co/palette/f8f9fa-e9ecef-dee2e6-ced4da-adb5bd-6c757d-495057-343a40-212529

const title = Indie_Flower({
  weight: "400",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <main className="bg-seasalt h-screen flex flex-col">
      <Header />

      <section>
        <div className="max-w-screen-lg mx-auto flex justify-between items-center md:mt-32 px-8 md:flex-row flex-col-reverse">
          <div className="max-w-[32rem]">
            <h1
              className={`${title.className} text-2xl font-bold text-black lg:text-4xl`}
            >
              Controle de perfomance com toda a <u>praticidade</u> que o papel
              não te oferece.
            </h1>

            <p className="text-lg text-black/70 mt-4">
              Organize seus hábitos, metas e seu dia a dia de uma forma simples
              e prática.
            </p>

            <Link href="/sign-in">
              {" "}
              <Button
                className="mt-16 w-60 h-12 flex items-center justify-between"
                variant="outline"
              >
                Crie sua conta
                <LuChevronRight />
              </Button>
            </Link>
          </div>

          <div>
            <Image src="/slides2.png" alt="slide2" width={400} height={400} />
          </div>
        </div>
      </section>

      <footer className="mt-auto w-full h-16 border-t relative bottom-0">
        <div className="max-w-screen-lg mx-auto h-full flex items-center justify-between px-8">
          <p className="text-black/70">MinimalBrain - 2024</p>
        </div>
      </footer>
    </main>
  );
}
