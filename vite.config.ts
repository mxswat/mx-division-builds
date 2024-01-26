import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue2'

export default ({ mode }) => {

  // grab the environment so we can set base to the BASE_URL value from the env file
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [vue()],
    base: env.BASE_URL,
  });
}