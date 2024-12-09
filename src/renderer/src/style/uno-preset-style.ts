import { definePreset, Preset } from 'unocss'

export default definePreset((): Preset => {
  return {
    name: 'kotodama',
    preflights: [],
    rules: [
      [
        'drag-none',
        {
          '-webkit-user-drag': 'none'
        }
      ],
      [
        'primary-border',
        {
          border: '1px solid var(--p-slate-200)',
          'border-radius': '0.5rem'
        }
      ],
      [
        'glassmorphism',
        {
          'background-color': 'rgba(255, 255, 255, 0.55)',
          'backdrop-filter': 'blur(14px)',
          'box-shadow': 'rgba(142, 142, 142, 0.15) 0 0.3rem 0.5rem 0',
          'border-radius': '0.5rem',
          border: '1px solid var(--p-slate-100)'
        }
      ],
      [
        'divider',
        {
          height: '1px',
          margin: '0.5rem 0',
          'background-color': 'var(--p-gray-300)'
        }
      ]
    ]
  }
})
