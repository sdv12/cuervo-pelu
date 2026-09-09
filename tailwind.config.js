/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Marca Cuervo Peluquería ──
        azul: '#12233F',
        'azul-2': '#1B3157',
        rojo: '#A32638',
        'rojo-2': '#8A1F2E',
        hueso: '#EFEBE2',
        panel: '#E4DFD1',
        tinta: '#201D1A',
        'tinta-suave': '#4A453E',
        dorado: '#B9925A',
        linea: '#CFC8B8',
        // ── Modo noche ──
        navy: '#0E1830',
        'navy-card': '#16213D',
        'navy-border': '#2B3958',
        'navy-text': '#ECE7DA',
        'navy-soft': '#AEB6C7',
        'navy-accent': '#E7A2AC',
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        sans: ['Work Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
