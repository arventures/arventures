module.exports = {
  siteMetadata: {
    description: "Welcome to ar.ventures",
    locale: "en",
    title: "Arvinder Singh",
    formspreeEndpoint: "https://formspree.io/f/mwkaevnw",
  },
  plugins: [
    {
      resolve: "@wkocjan/gatsby-theme-intro",
      options: {
        basePath: "/",
        contentPath: "content/",
        showThemeLogo: true,
        theme: "classic",
      },
    },
  ],
}
