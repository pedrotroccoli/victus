import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";

export const WhatsappButton = ({ locale }: { locale: string }) => {
  const messageByLocale = {
    en: "Hello, I need support from Victus!",
    es: "Hola, necesito soporte de Victus!",
    pt: "Olá, preciso de suporte da Victus!", 
  } as const;

  console.log(locale);

  const whatsappLink = `https://wa.me/5591989407261?text=${encodeURIComponent(messageByLocale[locale as keyof typeof messageByLocale])}`;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-white rounded-full p-3 border border-black shadow-lg block bg-[#25d366]">
        <WhatsappLogo size={40} color="white" />
      </a>
    </div>
  );
}