import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/logo-clara-mente.png"
              alt="ClaraMente"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-heading font-bold text-lg text-white">
              ClaraMente
            </span>
          </div>

          <p className="text-sm text-gray-400 text-center">
            Nutrición inteligente. Lista para vos.
          </p>

          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ClaraMente. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
