export default defineConfig({
  base: "./", // ensures relative asset resolution
  plugins: [tailwindcss()],
  root: "src",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        about: resolve(__dirname, "src/about.html"),
        contact: resolve(__dirname, "src/contact.html"),
        speakers: resolve(__dirname, "src/speakers.html"),
        team: resolve(__dirname, "src/team.html"),
      },
    },
  },
});
