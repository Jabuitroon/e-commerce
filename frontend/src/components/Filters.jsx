import { useFilter } from '../hooks/custHooks.jsx'

export function Filters () {
  const { filters, setFilter } = useFilter()

  // Se basa en el orden en que se llama al componente y posición
  // Identificador univaersal tanto en cliente como en servidor

  const handleChangePrice = (e) => {
    // "Dos fuentes de verdad"
    // const [minPrices, setMinPrices] = useState(0)
    // setMinPrices(e.target.value)
    setFilter(prevState => ({ ...prevState, minPrices: e.target.value }))
  }

  const handleChangeCategory = (e) => {
    // "Error de bulto"
    // Estamos pasando la funcion de actualizar el estado nativo de react de un com hijo a un padre
    // "Lo que necesitamos es más concreto"
    // setCategory(e.target.value)
    setFilter(prevState => ({ ...prevState, prime: true }))
  }

  return (
    <>
      <div className='filters'>
        <label htmlFor='price'>
          Rango de precios
          <input type='range' id='price' min='0' max='1000' onChange={handleChangePrice} />
        </label>
        <span>${filters.minPrices}</span>
      </div>
      <div>
        <label htmlFor='category'>
          Costrando category:
          <span>{filters.prime}</span>
          <select name='cat' id='category' onChange={handleChangeCategory}>
            <option value='Todas'>all</option>
            <option value='is_prime'>Prime</option>
            <option value='is_sponsored'>Sponsored</option>
          </select>
        </label>
      </div>
    </>
  )
}
