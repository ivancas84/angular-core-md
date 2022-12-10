export function timestamp(value: string): Date | null {
  let date: Date;
  let time_ = null;
  let time = null;

  switch(value){
    case null: return null;

    case "CURRENT_TIME": case "CURRENT_DATE": case "CURRENT_TIMESTAMP":
      date = new Date();
      date.setSeconds(0);
      return date;
      //return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);

    default:
      date = new Date(value);
      time_ = value.split(" ");
      time = time_[1].split(":");

      date.setHours(Number(time[0]));
      date.setMinutes(Number(time[1]));
      date.setSeconds(0);
      return date;
      //return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
  }
}
