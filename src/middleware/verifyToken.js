import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  try {
    // ambil data dari headers
    const auth = req.headers["authorization"];

    // validasi: jika auth dan token tidak ada
    if (!auth || !auth.split(" ")[1]) {
      return res.status(400).json({
        status: "error",
        message: "Data token tidak ada",
      });
    }

    // ambil token
    const token = auth.split(" ")[1];

    // // verifikasi token
    // jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (error, decoded) => {
    //   // validasi: jika token tidak valid
    //   if (error) {
    //     return res.status(403).json({
    //       status: "error",
    //       message: error.message,
    //     });
    //   }

    //   console.log("decoded.email : " + decoded.email);
    //   next();
    // });

    // verifikasi token
    const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);

    // validasi: jika token tidak valid
    if (!verifyToken) {
      return res.status(403).json({
        status: "error",
        message: "Token tidak valid",
      });
    }

    console.log("email : " + verifyToken.email);

    next();
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
