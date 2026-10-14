import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

function Item({ titulo, children, abiertoPorDefecto }) {
  const [abierto, setAbierto] = useState(!!abiertoPorDefecto)
  return (
    <div className="border-b border-linea last:border-0 dark:border-navy-border">
      <button
        type="button"
        onClick={() => setAbierto(a => !a)}
        className="flex w-full items-center justify-between gap-3 py-3.5 text-left text-[0.98rem] font-semibold text-azul dark:text-navy-text"
      >
        {titulo}
        <ChevronDown size={18} className={`flex-shrink-0 text-tinta-suave transition-transform dark:text-navy-soft ${abierto ? 'rotate-180' : ''}`} />
      </button>
      {abierto && <div className="pb-4 text-[0.9rem] leading-relaxed text-tinta-suave dark:text-navy-soft">{children}</div>}
    </div>
  )
}

export default function Ayuda() {
  const { esAdmin } = useAuth()

  return (
    <div>
      <h1 className="text-[1.4rem] uppercase text-azul dark:text-navy-text">Ayuda</h1>
      <p className="mt-1 text-[0.85rem] text-tinta-suave dark:text-navy-soft">
        Una guía rápida de para qué sirve cada pestaña. Tocá cada una para desplegarla.
      </p>

      <div className="mt-4 rounded-xl border border-linea bg-white px-4 dark:border-navy-border dark:bg-navy-card">
        <Item titulo="📅 Agenda" abiertoPorDefecto>
          <p>Acá ves los turnos del día (cambiá la fecha arriba a la derecha). Para cada turno podés:</p>
          <ul className="ml-4 mt-2 list-disc space-y-1">
            <li><strong>✓ verde</strong>: marcarlo completado — te pregunta cómo pagó (efectivo o transferencia).</li>
            <li><strong>✕ rojo</strong>: cancelarlo.</li>
            <li><strong>↺</strong>: si te equivocaste, lo volvés a "confirmado".</li>
          </ul>
          <p className="mt-2">El botón <strong>"Turno rápido"</strong> es para cuando llega alguien sin haber reservado antes: cargás nombre, servicio, con quién y hora, y queda en la agenda al toque.</p>
          <p className="mt-2">Más abajo, <strong>"Lista de espera"</strong> muestra quién quiere un horario que ahora está ocupado — si se libera, les avisás vos por WhatsApp.</p>
        </Item>

        <Item titulo="📊 Reportes">
          <p>Totales de plata por día, semana o mes: cuántos cortes, cuánto se cobró, separado por servicio y por cómo pagaron (efectivo/transferencia). Sirve para el cierre de caja.</p>
        </Item>

        <Item titulo="🧴 Productos">
          <p>Para registrar una venta de producto (bebida, nueces, lo que sea) apenas la hacés — elegís el producto, la cantidad, y si querés la vinculás al turno de ese cliente.</p>
          {esAdmin && <p className="mt-2">Como admin también editás acá los <strong>precios</strong> de cortes y productos, y los activás/desactivás.</p>}
        </Item>

        {esAdmin && (
          <Item titulo="👥 Empleados">
            <p>Crear cuentas nuevas de empleados, cambiarles el rol, activarlos/desactivarlos, y decidir si aparecen como opción para elegir al reservar un turno ("Sacar/Sumar a la reserva").</p>
          </Item>
        )}

        {esAdmin && (
          <Item titulo="🔍 Actividad">
            <p>El historial de todo lo importante que pasó: cambios de precio, cancelaciones, clientes nuevos y ventas de productos. Es de solo lectura — nadie lo puede editar, ni vos — así queda como registro confiable.</p>
          </Item>
        )}

        <Item titulo="❓ ¿Algo no funciona o tenés una duda?">
          <p>Escribile a Sergio (el que armó la página) y lo revisa.</p>
        </Item>
      </div>
    </div>
  )
}
