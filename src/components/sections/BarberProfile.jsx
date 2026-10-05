export default function BarberProfile() {
  return (
    <div className="mt-11 flex flex-col gap-6 border-t border-linea pt-9 dark:border-navy-border sm:flex-row sm:items-start">
      <img
        src="/equipo/cristian.webp"
        alt="Cristian, barbero y dueño de Cuervo Peluquería"
        loading="lazy"
        className="h-[96px] w-[96px] flex-shrink-0 rounded-full border-2 border-rojo object-cover object-top"
      />
      <div>
        <h3 className="mb-1.5 text-[1.1rem] normal-case text-azul dark:text-navy-text">
          Cristian — al frente de la tijera
        </h3>
        <p className="m-0 max-w-[56ch] text-[0.95rem] text-tinta-suave dark:text-navy-soft">
          Ocho años cortando en el barrio. Sabe exactamente qué fade te queda y qué no, y no te va a dejar
          salir con un corte que no te guste.
        </p>
        <span className="mt-2.5 inline-block rounded-full border border-rojo px-3 py-0.5 text-[0.8rem] font-semibold text-rojo">
          Hincha del Ciclón, se nota en la charla
        </span>
      </div>
    </div>
  )
}
