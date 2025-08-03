import os from 'os';

/** Determines the local IP address. */
export function get_ip(inDevMode = false, address?: string) {
  if (address) { return address; }
  let ip = '';
  const interfaces = os.networkInterfaces();
  for (let prop in interfaces) {
    const info = interfaces[prop];
    if (info) {
      info.map(interfac3 => {
        if (!inDevMode
          && interfac3.family === 'IPv4'
          && interfac3.address !== '127.0.0.1'
          && !interfac3.internal
        ) {
          ip = interfac3.address;
        } else if (inDevMode
          && interfac3.family === 'IPv4'
          && interfac3.internal
        ) {
          ip = interfac3.address;
        }
      });
    }
  }
  if (!ip) {
    throw new Error('Failed to resolve ip address. Check your logic!');
  }
  return ip;
}
