const frontendHost = process.env.FRONTEND_HOST;

if (!frontendHost) {
  throw new Error(`Missing environment variable FRONTEND_HOST.`);
}

if (frontendHost[frontendHost.length - 1] === "/") {
  throw new Error(`FRONTEND_HOST must not end with slashes.`);
}

export const FRONTEND_HOST = frontendHost;
