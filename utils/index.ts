export const shortenAddress = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`
}

export const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
}