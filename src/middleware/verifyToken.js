import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const verifyToken = (req, res, next) => {
  try {
    // Ambil data dari headers
    const auth = req.headers["authorization"];

    // Validasi: jika auth atau token tidak ada
    if (!auth || !auth.split(" ")[1]) {
      return res.status(400).json({
        status: "error",
        message: "Token tidak valid",
      });
    }

    // Ambil token
    const token = auth.split(" ")[1];

    // Verifikasi token dengan callback async
    jwt.verify(token, process.env.ACCESS_TOKEN_KEY, async (error, decoded) => {
      // Validasi: jika token tidak valid
      if (error) {
        return res.status(401).json({
          status: "error",
          message: error.message,
        });
      }

      // Cek user berdasarkan token di database
      const user = await prisma.user.findFirst({
        where: {
          accessToken: token,
        },
      });

      // Validasi: jika user tidak ada
      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      // kirimkan user
      req.user = user;

      // Jika semua validasi berhasil, lanjutkan ke middleware atau endpoint berikutnya
      next();
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
