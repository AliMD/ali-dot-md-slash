export function getEnv (name) {
  log(`getEnv: ${name}`);
  if (!name) {
    log('getEnv: env name is empty !');
    return '';
  }

  let env = process.env[name];
  if (typeof env === 'string') {
    env = env.replace(/\$([^/$]+)/g, (_, n) => {
      return process.env[n] || ('$'+n);
    });
  }
  return env;
}
