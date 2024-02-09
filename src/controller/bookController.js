import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const addBookController = async (req, res) => {
  try {
    // ambil data dari req.body
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
    // ambil semua data buku
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

const getBookByIdController = async (req, res) => {
  try {
    // ambil id dari req.params
    const id = parseInt(req.params.id);

    // validasi: pastikan client mengirimkan id
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Id buku tidak boleh kosong",
      });
    }

    // cek id buku di database
    const book = await prisma.book.findUnique({
      where: {
        id,
      },
    });

    //validasi: jika buku tidak ada
    if (!book) {
      return res.status(404).json({
        status: "error",
        message: "Data buku tidak ada",
      });
    }

    // berikan response success
    return res.json({
      status: "success",
      message: "Berhasil mendapatkan data buku",
      book,
    });
  } catch (error) {
    // berikan response error
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export { addBookController, getBookController, getBookByIdController };
