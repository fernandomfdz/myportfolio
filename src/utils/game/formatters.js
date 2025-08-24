// Enhanced number formatting with full precision
export function formatNumber(num, showDecimals = false) {
  if (num < 1000) {
    return showDecimals ? num.toFixed(1) : Math.floor(num).toString()
  }
  
  const units = [
    { value: 1e63, symbol: 'Vigintillion' },
    { value: 1e60, symbol: 'Novemdecillion' },
    { value: 1e57, symbol: 'Octodecillion' },
    { value: 1e54, symbol: 'Septendecillion' },
    { value: 1e51, symbol: 'Sexdecillion' },
    { value: 1e48, symbol: 'Quindecillion' },
    { value: 1e45, symbol: 'Quattuordecillion' },
    { value: 1e42, symbol: 'Tredecillion' },
    { value: 1e39, symbol: 'Duodecillion' },
    { value: 1e36, symbol: 'Undecillion' },
    { value: 1e33, symbol: 'Decillion' },
    { value: 1e30, symbol: 'Nonillion' },
    { value: 1e27, symbol: 'Octillion' },
    { value: 1e24, symbol: 'Septillion' },
    { value: 1e21, symbol: 'Sextillion' },
    { value: 1e18, symbol: 'Quintillion' },
    { value: 1e15, symbol: 'Quadrillion' },
    { value: 1e12, symbol: 'Trillion' },
    { value: 1e9, symbol: 'Billion' },
    { value: 1e6, symbol: 'Million' },
    { value: 1e3, symbol: 'K' }
  ]

  for (let unit of units) {
    if (num >= unit.value) {
      const value = num / unit.value
      return `${Math.floor(value)}${unit.symbol}`
    }
  }
  
  return Math.floor(num).toString()
}

export function formatWithoutDecimals(num) { 
  return (new Intl.NumberFormat('es-es', {minimumFractionDigits:0,maximumFractionDigits:0})).format(num)
}

// Short format for UI where space is limited
export function formatNumberShort(num) {
  if (num < 1000) return Math.floor(num).toString()
  if (num < 1000000) return Math.floor(num / 1000) + 'K'
  if (num < 1000000000) return Math.floor(num / 1000000) + 'M'
  if (num < 1000000000000) return Math.floor(num / 1000000000) + 'B'
  if (num < 1000000000000000) return Math.floor(num / 1000000000000) + 'T'
  return Math.floor(num / 1000000000000000) + 'Q'
}

// Format for click effects with + sign
export function formatClickGain(num) {
  return `+${formatNumberShort(num)}`
}

// Format time duration
export function formatTime(seconds) {
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

// Format percentage
export function formatPercentage(decimal, decimals = 1) {
  return `${(decimal * 100).toFixed(decimals)}%`
}