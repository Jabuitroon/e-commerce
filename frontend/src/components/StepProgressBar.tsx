export interface Step {
  id: number
  label: string
}

interface StepProgressBarProps {
  steps: Step[]
  currentStep: number // ID del paso activo o > steps.length cuando se completa todo
}

export function StepProgressBar({ steps, currentStep }: StepProgressBarProps) {
  // Garantizamos que la barra no sobrepase el 100%
  const progressPercentage = Math.min(
    ((currentStep - 1) / (steps.length - 1)) * 100,
    100,
  )

  const isAllCompleted = currentStep > steps.length

  return (
    <div className='mb-4 mx-auto max-w-xl'>
      <div className='relative flex items-center justify-between'>
        {/* Línea conectora base (fondo gris) */}
        <div className='absolute left-0 right-0 top-1/2 -z-10 h-0.5 -translate-y-1/2 bg-gray-200' />

        {/* Línea conectora de progreso (activa) */}
        <div
          className={`absolute left-0 top-1/2 -z-10 h-0.5 -translate-y-1/2 transition-all duration-500 ease-in-out ${
            isAllCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />

        {steps.map((step) => {
          const isCompleted = step.id < currentStep
          const isActive = step.id === currentStep
          const isLastStep = step.id === steps.length

          // Si es el último paso Y ya finalizó todo el proceso
          const isFinalStepCompleted = isLastStep && isAllCompleted

          return (
            <div
              key={step.id}
              className='flex flex-col items-center gap-1 bg-white px-3'
            >
              {/* Círculo indicador del paso */}
              <div
                className={`flex items-center justify-center rounded-full font-bold transition-all duration-300 ${
                  isFinalStepCompleted
                    ? 'h-10 w-10 bg-emerald-100 text-emerald-600 animate-bounce shadow-md'
                    : isCompleted
                      ? 'h-8 w-8 bg-indigo-600 text-white shadow-sm'
                      : isActive
                        ? 'h-8 w-8 bg-indigo-600 text-white shadow-md ring-4 ring-indigo-100'
                        : 'h-8 w-8 border border-gray-300 bg-gray-100 text-gray-400 text-sm'
                }`}
              >
                {isCompleted ? (
                  /* Ícono de Check para pasos completados */
                  <svg
                    className={isFinalStepCompleted ? 'h-6 w-6' : 'h-4 w-4'}
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                ) : (
                  step.id
                )}
              </div>

              {/* Etiqueta del paso */}
              <span
                className={`text-xs transition-colors duration-300 ${
                  isFinalStepCompleted
                    ? 'font-bold text-emerald-600'
                    : isCompleted || isActive
                      ? 'font-bold text-indigo-600'
                      : 'font-medium text-gray-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
