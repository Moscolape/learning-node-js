exports.get404 = (req, res, next) => {
  res.status(404).render("not-found", {
      docTitle: "Page Not Found",
      path: "/not-found"
  });
};

exports.get500 = (req, res, next) => {
  res.status(500).render("server-error", {
      docTitle: "Server Error",
      path: "/server-error"
  });
};