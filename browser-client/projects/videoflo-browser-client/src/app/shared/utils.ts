export class Utils {
  public static dateDiff(
    dateStart: Date,
    dateEnd: Date | string = new Date(),
    ...units: string[]
  ): {
    [key: string]: number;
  } {
    if (typeof dateEnd === 'string') {
      dateEnd = new Date();
    }

    let delta: number = Math.abs(dateStart.getTime() - dateEnd.getTime());

    const dateDiffDef = {
      millenniums: 31536000000000,
      centuries: 3153600000000,
      decades: 315360000000,
      years: 31536000000,
      quarters: 7776000000,
      months: 2592000000,
      weeks: 604800000,
      days: 86400000,
      hours: 3600000,
      minutes: 60000,
      seconds: 1000,
      milliseconds: 1,
    };

    return (units.length ? units : Object.keys(dateDiffDef)).reduce(
      (res: object, key: string) => {
        if (!dateDiffDef.hasOwnProperty(key)) {
          throw new Error('Unknown unit in dateDiff: ' + key);
        }
        res[key] = Math.floor(delta / dateDiffDef[key]);
        delta -= res[key] * dateDiffDef[key];
        return res;
      },
      {}
    );
  }

  // Returns true if 'toDate' is greater than 'fromDate'
  public static isDateGreaterThan(todate: Date, from: Date): boolean {
    // There are 10000 ticks in a millisecond. And 621.355.968.000.000.000 ticks between 1st Jan 0001 and 1st Jan 1970.
    const fromDateTick = from.getTime() * 10000 + 621355968000000000;
    const toDateTick = todate.getTime() * 10000 + 621355968000000000;
    if (toDateTick >= fromDateTick) {
      return true;
    }
    return false;
  }

  public static shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }


  public static async delay(ms: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms));
  }
}
