export default function BarberProfile() {
  return (
    <div className="mt-11 flex flex-col gap-6 border-t border-linea pt-9 dark:border-navy-border sm:flex-row sm:items-start">
      <div className="flex h-[76px] w-[76px] flex-shrink-0 items-center justify-center rounded-full bg-azul">
        <svg viewBox="0 0 24 24" fill="none" stroke="#EFEBE2" strokeWidth="2" className="h-[38px] w-[38px]">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
      </div>
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
