import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes",
  description: "Respuestas a las preguntas más frecuentes sobre ClaraMente.",
};

const faqs = [
  {
    question: "¿Cuánto dura la clara de huevo cerrada?",
    answer:
      "Cerrada y refrigerada entre 0°C y 4°C, tiene una vida útil de 30 a 45 días desde la fecha de elaboración. Revisá siempre la fecha de vencimiento en el envase.",
  },
  {
    question: "¿Cuánto dura una vez abierta?",
    answer:
      "Una vez abierta, debe consumirse dentro de los 3 a 5 días, siempre manteniendo la cadena de frío (0°C a 4°C).",
  },
  {
    question: "¿Cómo confirmo mi pago?",
    answer:
      "Después de realizar la transferencia, podés subir el comprobante desde la página de tu pedido o enviarlo por WhatsApp indicando tu número de orden.",
  },
  {
    question: "¿Hacen envíos a todo el país?",
    answer:
      "Por el momento realizamos envíos a zonas habilitadas para garantizar la cadena de frío. Al ingresar tu código postal en el checkout, el sistema te indica si tu zona tiene cobertura.",
  },
  {
    question: "¿Tienen precios mayoristas?",
    answer:
      "Sí, visitá la sección Mayorista en nuestra tienda. Para consultas especiales o volúmenes grandes, contactanos por WhatsApp.",
  },
  {
    question: "¿Es necesario crear una cuenta?",
    answer:
      "No, no necesitás registrarte. Solo completás tus datos en el checkout y listo.",
  },
  {
    question: "¿Cuándo es gratis el envío?",
    answer:
      "El envío es gratis en pedidos de más de 12 unidades. Caso contrario, se aplica un costo de envío que se muestra en el checkout.",
  },
  {
    question: "¿Qué métodos de pago aceptan?",
    answer:
      "Aceptamos transferencia bancaria. Una vez que realizás el pedido, te mostramos los datos bancarios para que hagas la transferencia.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="font-heading text-3xl md:text-4xl font-bold text-gray-900 mb-8">
        Preguntas Frecuentes
      </h1>

      <div className="space-y-3">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            <summary className="flex items-center justify-between cursor-pointer px-6 py-4 font-semibold text-gray-900 hover:bg-gray-50 transition-colors">
              {faq.question}
              <span className="ml-4 text-brand-blue group-open:rotate-45 transition-transform text-xl font-bold">
                +
              </span>
            </summary>
            <div className="px-6 pb-4 text-gray-600 leading-relaxed">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
