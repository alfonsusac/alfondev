export function date(date: Date, variant: "month-year") {
  if (variant === "month-year") {
    const month = date.toLocaleString('default', { month: 'short' })
    const year = date.getFullYear()
    return `${ month } ${ year }`
  }
}

export function range(
  a: Date,
  b: Date | undefined,
  variant: "month-year" | "year"
) {
  if (variant === "month-year") {
    const monthA = a.toLocaleString('default', { month: 'short' })
    const yearA = a.getFullYear()
    if (!b) {
      return `${ monthA } ${ yearA }`
    }
    const monthB = b.toLocaleString('default', { month: 'short' })
    const yearB = b.getFullYear()
    if (yearA === yearB) {
      if (monthA === monthB) {
        return `${ monthA } ${ yearA }`
      }
      return `${ monthA } - ${ monthB } ${ yearA }`
    }
    return `${ monthA } ${ yearA } - ${ monthB } ${ yearB }`
  }
  if (variant === "year") {
    const yearA = a.getFullYear()
    if (!b) {
      return `${ yearA }`
    }
    const yearB = b.getFullYear()
    if (yearA === yearB) {
      return `${ yearA }`
    }
    return `${ yearA } - ${ yearB }`
  }
}