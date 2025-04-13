import { cn } from "@/lib/utils"
import { Desktop, DeviceMobile } from "@phosphor-icons/react/dist/ssr"
import Image from "next/image"
import { Grid } from "../grid"

export const items = [
  {
    icon: Desktop,
    enabled: true,
    title: 'Plataforma Desktop',
    description: 'A nossa plataforma desktop já está disponível para uso.',
    image_url: '/news-desktop.png'
  },
  {
    icon: DeviceMobile,
    enabled: false,
    title: 'Plataforma Mobile',
    description: 'Os nossos apps mobile já estão em construção e logo estarão prontos para uso.',
    image_url: '/news-mobile.png'
  },
  {
    icon_url: '/world-logo.png',
    enabled: false,
    title: 'Integração com a World Foundation',
    description: 'A integração com a World Chain está próxima e com ela vem desafios, integrações e ganhos de WLD tokens!',
    image_url: '/news-world.png'
  },
]

export const News = () => {
  return (
    <section>
      <Grid className="pt-16">
        <h2 className="text-2xl font-bold font-mono mx-auto text-center mb-16">Novidades</h2>
        <ul className="grid gap-8">
          {items.map((item) => (
            <li key={item.title}>
              <div className="w-full h-[19rem] bg-white border border-neutral-300 rounded-lg flex justify-between flex-1">
                <div className="h-full flex flex-col justify-center items-center">
                  <div className="pl-10">
                    <div className="flex items-center gap-6">
                      {item.icon_url && <Image src={item.icon_url} alt={item.title} width={80} height={20} />}
                      {item.icon && <item.icon size={48} />}
                      {item.enabled && <p className="text-victus-dark-green bg-victus-dark-green/10 border border-victus-dark-green px-4 py-0.5 rounded-full font-mono font-medium">
                        Disponível
                      </p>}
                      {!item.enabled && <p className="text-yellow-400 bg-victus-yellow-400/10 border border-victus-yellow-400 px-4 py-0.5 rounded-full font-mono font-medium">
                        Em breve
                      </p>}
                    </div>
                    <h3 className="text-2xl font-bold font-mono mt-6">
                      {item.title}
                    </h3>
                    <p className="text-victus-text mt-4 max-w-[32rem]">
                      {item.description}
                    </p>
                  </div>
                </div>
                <div className={cn("max-w-[33rem] w-full h-full bg-victus-green rounded-r-lg bg-cover bg-center")} style={{ backgroundImage: `url(${item.image_url})` }}></div>
              </div>
            </li>
          ))}
        </ul>
      </Grid>
    </section>
  )
}