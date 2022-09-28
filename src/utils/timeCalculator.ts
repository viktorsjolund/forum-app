export const getDateAge = (dateString: string) => {
  const currentDate = new Date()
  const oldDate = new Date(dateString)
  const milliSecDiff = currentDate.getTime() - oldDate.getTime()
  const seconds = Math.floor(milliSecDiff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (minutes < 1) {
    return `${seconds} second(s) ago`
  } else if (minutes > 0 && hours < 1) {
    return `${minutes} minute(s) ago`
  } else if (hours > 0 && days < 1) {
    return `${hours} hour(s) ago`
  } else {
    return `${days} day(s) ago`
  }
}