// import Bowser from 'bowser';

interface IValidationError {
  _fileName: string;
  _fileSize: number;
  _isMatchedExt: boolean;
  _isSizeExceeds: boolean;
}

interface IBrowserInfo {
  browser_id: string;
  browser_name: string;
  browser_version: string;
  session_id: string;
}

/**
 * *Uploaded file size and extension validation
 *
 * @param event javascript file change event
 *
 */
export function fileUploadValidation(
  event: Event,
  fileSize: number,
  fileSizeType: 'kb' | 'mb',
  fileTypes: string[]
): IValidationError[] {
  fileSize = fileSize || 1;
  const validationInfo: IValidationError[] = [];
  const files = (event.target as HTMLInputElement).files as FileList;

  if (files.length > 0) {
    // Getting list of files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const _fileName = file.name; // file name
      const _fileSize = file.size; // file size
      const _fileTypes = fileTypes; // preferred extensions
      const _sizeInMB = _fileSize / (1024 * 1024);
      const _sizeInKB = _fileSize / 1024;

      const _fileExtension = _fileName
        .split('.')
        [_fileName.split('.').length - 1].toLowerCase(); // file extension

      const _isMatchedExt: boolean = _fileTypes.indexOf(_fileExtension) > -1;
      const _isSizeExceeds: boolean =
        fileSizeType === 'mb' ? _sizeInMB > fileSize : _sizeInKB > fileSize;

      validationInfo.push({
        _fileName,
        _fileSize,
        _isMatchedExt,
        _isSizeExceeds,
      });
    }
    return validationInfo;
  } else {
    return validationInfo;
  }
}

/**
 * *Abbreviates a large number by adding a suffix to it (e.g. 1000 => 1k)
 *
 * @param {number} value - The number to be abbreviated
 * @returns The abbreviated number
 *
 *
 */
export function toAbbreviateNumber(value: number): number {
  let newValue: number = value;
  if (value >= 1000) {
    const suffixes = ['', 'k', 'm', 'b', 't'];
    const suffixNum = Math.floor(('' + value).length / 3);
    let shortValue!: number;
    for (let precision = 2; precision >= 1; precision--) {
      shortValue = parseFloat(
        (suffixNum !== 0
          ? value / Math.pow(1000, suffixNum)
          : value
        ).toPrecision(precision)
      );
      const dotLessShortValue = (shortValue + '').replace(
        /[^a-zA-Z 0-9]+/g,
        ''
      );
      if (dotLessShortValue.length <= 2) {
        break;
      }
    }
    if (shortValue % 1 !== 0) {
      shortValue = +shortValue.toFixed(1);
    }
    newValue = +(shortValue + suffixes[suffixNum]);
  }
  return newValue;
}

/**
 * *Returns formatted time value based on the specified timestamp and returnType.
 *
 * @param {number} timestamp - Unix timestamp in seconds
 * @param {'hour' | 'minute' | 'second'} returnType - Type of time value to return
 * @returns {number} - Time value of the specified returnType (hour, minute or second)
 *
 *
 */
export function formattedTime(
  timestamp: number,
  returnType: 'hour' | 'minute' | 'second'
): number {
  const unix_timestamp = timestamp;
  const date = new Date(unix_timestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  let toReturn!: number;

  switch (returnType) {
    case 'hour':
      toReturn = hours;
      break;
    case 'minute':
      toReturn = minutes;
      break;
    case 'second':
      toReturn = seconds;
      break;
    default:
      break;
  }

  return toReturn;
}

/**
 * *Generate an array of time ranges based on the provided time interval.
 *
 * @param {number} interval - The interval of minutes between each range.
 * @param {number} startHour - The starting hour for the range. Defaults to 9.
 * @param {window.navigator.language} language - The language code used for formatting the time. Defaults to the user's browser language.
 * @returns An array of objects containing the id and formatted time for each range.
 *
 *
 */
export function getHourRanges(
  interval: number,
  startHour = 9,
  language = window.navigator.language
): {
  id: number;
  time: string;
}[] {
  const date = new Date();
  const ranges = [];

  for (
    let index = 0, minutes = 0;
    minutes < 24 * 60;
    minutes = minutes + interval
  ) {
    index++;
    date.setHours(startHour);
    date.setMinutes(minutes);
    ranges.push({
      id: index,
      time: date.toLocaleTimeString(language, {
        hour: 'numeric',
        minute: 'numeric',
      }),
    });
  }

  return ranges;
}

/**
 * *Promisified function that reads a file and returns its Base64 representation
 *
 * @param {File} file - The file to be converted to Base64
 * @returns A Promise that resolves with the Base64 string of the file
 *
 *
 */
export function getBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

/**
 * *Determines whether a given string is a valid URL.
 *
 * @param {string} url - The string to test for URL validity.
 * @returns `true` if the string is a valid URL, `false` otherwise.
 *
 *
 */
export function isURL(string: string): boolean {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(string);
}

/**
 * *Generating random string
 * @param length : length of the string to return
 *
 *
 */
export function generateRandomString(length: number) {
  let randomString = '';
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    randomString += possible.charAt(
      Math.floor(Math.random() * possible.length)
    );
  }
  return randomString;
}

/**
 * *Generate random browser id and get browser info using Bowser package
 *
 * @returns browser id,browser name,browser version
 *
 */
// export function browserInfo(): IBrowserInfo {
//   const browserInfo = Bowser.getParser(window.navigator.userAgent).getResult();
//   let sessionId = generateRandomString(32);
//   const browserName = browserInfo.browser.name;
//   const browserVersion = browserInfo.browser.version;
//   const currentBrowserId = localStorage.getItem('browser-id');
//   let currentSessionId = sessionStorage.getItem('session-id');

//   let browseId = `${generateRandomString(32)}-${browserName}-${browserVersion}`;
//   // re-generate browser_id if required
//   if (!currentBrowserId) {
//     localStorage.setItem('browser-id', browseId);
//   } else {
//     browseId = currentBrowserId;
//   }
//   if (!currentSessionId) {
//     sessionStorage.setItem('session-id', sessionId);
//   } else {
//     sessionId = currentSessionId;
//   }
//   return {
//     browser_id: browseId,
//     browser_name: browserName,
//     session_id: sessionId,
//     browser_version: browserVersion,
//   } as IBrowserInfo;
// }
