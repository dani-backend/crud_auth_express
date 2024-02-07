import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const addBookController = async (req, res) => {
  try {
    const { title, author, price } = req.body;

    // validasi: pastikan title, author, dan price tidak kosong
    if (!title || !author || !price) {
      return res.status(400).json({
        status: "error",
        message: "Data tidak tidak boleh kosong",
      });
    }

    // simpan data ke database
    const book = await prisma.book.create({
      data: {
        title,
        author,
        price,
      },
    });

    // respon success
    return res.status(201).json({
      status: "success",
      message: "Buku berhasil ditambahkan",
      bookId: book.id,
    });
  } catch (error) {
    // respon error
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getBookController = async (req, res) => {
  try {
    const books = await prisma.book.findMany();

    // validasi: jika buku tidak ada
    if (books.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Data buku tidak ditemukan",
      });
    }

    // response success
    return res.json({
      status: "success",
      message: "Data buku berhasil didapatkan",
      books,
    });
  } catch (error) {
    // respon error
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export { addBookController, getBookController };
