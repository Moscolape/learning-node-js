exports.get404 = (req, res, next) => {
  res.status(404).render("not-found", {
      docTitle: "Page Not Found",
      path: "/not-found"
  });
};
