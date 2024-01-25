// This exists to fix a bug in vite where it doesn't serve .env files
export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'application/javascript');
  return 'console.log("Fake Env Route")';
});
