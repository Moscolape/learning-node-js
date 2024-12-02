const requestHandler2 = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>Enter Name</title></head>");
    res.write(
      "<body><form action='/create-user' method='POST'><input type='text' name='message'/><button type='submit'>Send</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log(parsedBody);
      const message = parsedBody.split("=")[1].replace(/\+/g, " ");
      console.log(message);

      if (message !== "") {
        res.write("<html>");
        res.write("<head><title>User Name</title></head>");
        res.write(`<body><h1>Hello ${message}</h1></body>`);
        res.write("</html>");
        return res.end();
      }

      res.statusCode = 400;
      res.write("<html>");
      res.write("<head><title>Error</title></head>");
      res.write("<body><h1>No message provided!</h1></body>");
      res.write("</html>");
      return res.end();
    });

    return;
  }

  if (url === "/users") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write("<head><title>All Users</title></head>");
    res.write("<body><ul><li>User 1</li><li>User 2</li></ul></body>");
    res.write("</html>");
    res.end();
  }

  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>Not Found</title></head>");
  res.write("<body><h1>Oops! Page doesn't exist</h1></body>");
  res.write("</html>");
  res.end();
};

module.exports = requestHandler2;
