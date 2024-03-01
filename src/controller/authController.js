import jwt from "jsonwebtoken";
import bcrypt, { hash } from "bcrypt";
import validator from "validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    // ambil data dari client
    const { email, password, confPassword } = req.body;

    // validasi: jika user kurang mengirimkan data
    if (!email || !password || !confPassword) {
      return res.status(400).json({
        status: "error",
        message: "Data email, password, dan confirm password harus diisi",
      });
    }

    // validasi: jika email tidak valid
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Email tidak valid",
      });
    }

    // validasi: jika password dan confPassword tidak sama
    if (password !== confPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password harus sama",
      });
    }

    // cek apakah user sudah ada yang daftar
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // validasi: jika user sudah ada
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User sudah ada",
      });
    }

    // enkripsi password
    const hashPassword = await bcrypt.hash(password, 10);

    // buat object user
    const newUser = {
      email,
      password: hashPassword,
    };

    // tambahkan data ke db
    const user = await prisma.user.create({
      data: newUser,
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Gagal mendaftar",
      });
    }

    // berikan response success
    return res.status(201).json({
      status: "success",
      message: "Berhasil mendaftar",
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export { register };
