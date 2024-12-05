export const getTransitionOrigin = (index: number, lineCount: number, total: number) => {
  const bottomLength = total - (total % lineCount > 0 ? total % lineCount : lineCount)
  let left = false,
    right = false,
    top = false,
    bottom = false
  if (index % lineCount === 0) left = true
  if (index % lineCount === lineCount - 1) right = true
  if (index < lineCount) top = true
  if (index >= bottomLength) bottom = true
  return {
    'transform-origin': `${left ? 'left' : right ? 'right' : 'center'} ${
      top ? 'top' : bottom ? 'bottom' : 'center'
    }`
  }
}
