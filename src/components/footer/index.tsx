import Image from "next/image";
import Link from "next/link";
import { Grid } from "../grid";
import { BackToTop } from "./back-to-top";

export const links = [
  {
    title: 'Sobre',
    links: [
      {
        title: 'Missão',
        href: '/sobre'
      }
    ]
  },
  {
    title: 'Redes Sociais',
    links: [
      {
        title: 'Instagram',
        href: '/sobre'
      },
      {
        title: 'Instagram',
        href: '/sobre'
      },
    ]
  },
  {
    title: 'Links',
    links: [
      {
        title: 'Termos de uso',
        href: '/sobre'
      },
      {
        title: 'Política de privacidade',
        href: '/sobre'
      },
    ]
  }
]
export const Footer = () => {
  return (
    <>
      <div className="bg-victus-black bg-[url('/noise-1.png')] bg-cover bg-center w-full">
        <div className="w-full bg-[#f7f7f7] h-40 border-b border-neutral-300 rounded-b-[6rem] overflow-hidden">
          <Grid>
          </Grid>

        </div>

        <footer className="w-full">
          <div className="grid-container py-20 flex justify-between w-full ">
            <div className="bg-white/10 border border-white/30 rounded-lg w-20 h-20 flex items-center justify-center">
              <Image src="/brain-logo.svg" alt="logo" width={40} height={40} className="invert" />
            </div>

            <ul className="grid grid-cols-3 gap-8 max-w-[44rem] w-full">
              {links.map((link) => (
                <li key={link.title}>
                  <h4 className="text-white font-mono font-medium w-full">{link.title}</h4>
                  <div className="w-full h-px bg-neutral-800 my-4"></div>
                  <ul className="grid gap-4">
                    {link.links.map((link) => (
                      <li key={link.title}>
                        <Link href={link.href} className="text-white/70">
                          {link.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full h-40 relative overflow-hidden">
            <h1 className="text-[7.5rem] font-mono font-bold absolute -bottom-1/3 left-1/2 -translate-x-1/2 whitespace-nowrap text-white">Victus Journal</h1>
          </div>
          <div className="w-full h-20 border-t border-neutral-800">
            <Grid style="black" className="flex items-center justify-between h-full">
              <h5 className="text-white/70">MinimalBrain - 2024</h5>
              <BackToTop />
            </Grid>
          </div>
        </footer>


      </div>
    </>
  )
}