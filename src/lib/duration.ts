export type Duration =
  | `${ number }s`
  | `${ number }m`
  | `${ number }s ${ number }m`
  | `${ number }h`
  | `${ number }m ${ number }h`
  | `${ number }d`
  | `${ number }h ${ number }d`
  | `${ number }mo`
  | `${ number }d ${ number }mo`
  | `${ number }y`
  | `${ number }mo ${ number }y`

export function durationToMiliseconds(duration: Duration) {
  const regex = /(\d+)\s*(s|m|h|d|mo|y)/g
  let totalMs = 0
  let match
  while ((match = regex.exec(duration)) !== null) {
    const value = parseInt(match[1], 10)
    const unit = match[2]

    switch (unit) {
      case 's':
        totalMs += value * 1000
        break
      case 'm':
        totalMs += value * 60 * 1000
        break
      case 'h':
        totalMs += value * 60 * 60 * 1000
        break
      case 'd':
        totalMs += value * 24 * 60 * 60 * 1000
        break
      case 'mo':
        totalMs += value * 30 * 24 * 60 * 60 * 1000
        break
      case 'y':
        totalMs += value * 365 * 24 * 60 * 60 * 1000
        break
    }
  }
  return totalMs
}
  
export function durationToSeconds(duration: Duration) {
  return Math.floor(durationToMiliseconds(duration) / 1000)
}
