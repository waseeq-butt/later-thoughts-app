export const vibrate = (ms: number | number[] = 30) => {
  try {
    navigator.vibrate?.(ms)
  } catch {
    /* unsupported */
  }
}
