export const shortenAddress = (address: string) => {
  return `${address.slice(0, 5)}...${address.slice(-4)}`
}

export const padTo2Digits = (num: number) => {
  return num.toString().padStart(2, '0');
}

export const dateWithHyphens = (eventDate: Date) => {
  const year = eventDate.getFullYear();
  const month = padTo2Digits(eventDate.getMonth() + 1);
  const day = padTo2Digits(eventDate.getDate());

  return [year, month, day].join('-');
}

export const timeWithColon = (eventTime: any) => {
  const hours = eventTime?.getHours();
  const minutes = eventTime?.getMinutes();

  return [hours, minutes].join(':');
}