exports.get404 = (req, res, next) => {
  res.status(404).render("/not-found", { docTitle: "Error 404" });
};
