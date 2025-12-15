export function txtdecode(Incode: string, passCode: string): string {
  const b52 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let maxPC = 0;

  for (let i = 0; i < passCode.length; i++) {
    maxPC += passCode.charCodeAt(i);
  }

  let maxPCmod = maxPC;
  let ifPC = 0;

  const IncodeMatches = Incode.match(/\d+\w/g);
  let rexcode = '';
  let numPC = 0;

  const IncodeArray = IncodeMatches || [];

  for (let i = 0; i < IncodeArray.length; i++) {
    if (numPC === passCode.length) numPC = 0;

    if (maxPCmod < 1) maxPCmod = maxPC + ifPC;

    ifPC += maxPCmod % passCode.charCodeAt(numPC);
    const iscode = maxPCmod % passCode.charCodeAt(numPC);

    const currentCode = IncodeArray[i];
    const numberPart = parseInt(currentCode);
    const letterPart = b52.indexOf(currentCode.substr(-1));
    const nCode = numberPart * 52 + letterPart;

    maxPCmod -= passCode.charCodeAt(numPC);
    numPC++;

    rexcode += String.fromCharCode(nCode - iscode);
  }

  return rexcode;
}

export default txtdecode;
