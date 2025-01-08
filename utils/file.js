const fs = require("fs");
const path = require("path");

exports.deleteFile = (filePath) => {
  const fullPath = path.join(__dirname, "..", filePath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.log(`Failed to delete file at ${fullPath}:`, err.message);
    } else {
      console.log("File deleted successfully:", fullPath);
    }
  });
};