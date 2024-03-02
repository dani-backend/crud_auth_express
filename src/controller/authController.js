import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
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

const login = async (req, res) => {
  try {
    // ambil data dari req.body
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Data email dan password harus diisi",
      });
    }

    // cek user berdasarkan email di db
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // validasi: jika user tidak ada
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User tidak ditemukan",
      });
    }

    // compare password
    const matchPassword = await bcrypt.compare(password, user.password);

    // validasi: jika password tidak sama
    if (!matchPassword) {
      return res.status(400).json({
        status: "error",
        message: "Password salah",
      });
    }

    // buat access token
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: "30s",
    });

    // simpan access token di cookie
    res.cookie("accessToken", accessToken, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    // berikan response success
    return res.json({
      status: "success",
      message: "Berhasil masuk",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export { register, login };
