import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export interface DropdownOption {
  cat_id: string | number
  cat_descripcion: string | number
  cat_nombre: string
}

interface DropdownProps {
  options: DropdownOption[]
  placeholder?: string
  onChange?: (option: DropdownOption) => void
  className?: string
  disabled?: boolean
}

export const Dropdown: React.FC<DropdownProps> = ({
  options,
  placeholder = 'Select an option',
  onChange,
  className = '',
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(
    null
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleOptionClick = (option: DropdownOption) => {
    setSelectedOption(option)
    setIsOpen(false)
    if (onChange) {
      onChange(option)
    }
  }

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
    } else if (e.key === 'Enter' || e.key === ' ') {
      toggleDropdown()
    }
  }

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type='button'
        className={`flex items-center justify-between w-full px-4 py-2 text-left bg-white border rounded-md shadow-sm ${
          disabled
            ? 'cursor-not-allowed opacity-60'
            : 'hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        }`}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        disabled={disabled}
      >
        <span className='block truncate'>
          {selectedOption ? selectedOption.cat_nombre : placeholder}
        </span>
        <ChevronDown
          className={`w-5 h-5 ml-2 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className='absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg max-h-60 overflow-auto ring-1 ring-black ring-opacity-5 focus:outline-none'>
          <ul
            className='py-1'
            role='listbox'
            aria-labelledby='dropdown-button'
            tabIndex={-1}
          >
            {options.map((option) => (
              <li
                key={option.cat_id}
                className={`cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 ${
                  selectedOption?.cat_id === option.cat_id ? 'bg-gray-100' : ''
                }`}
                role='option'
                aria-selected={selectedOption?.cat_id === option.cat_id}
                onClick={() => handleOptionClick(option)}
              >
                <span className='block truncate'>{option.cat_nombre}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
