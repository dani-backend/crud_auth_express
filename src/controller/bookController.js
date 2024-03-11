import { PrismaClient } from "@prisma/client";
import { uploadFileToSupabase } from "../utils/uploadFileToSupabase.js";
import supabase from "../config/supabaseConfig.js";

const prisma = new PrismaClient();

const addBookController = async (req, res) => {
  try {
    // ambil data dari req.body
    const { title, author } = req.body;
    const price = parseFloat(req.body.price);
    let cover = "";

    // validasi: pastikan title, author, dan price tidak kosong
    if (!title || !author || !price) {
      return res.status(400).json({
        status: "error",
        message: "Data tidak tidak boleh kosong",
      });
    }

    // validasi: jika ada file
    if (req.file) {
      // ambil file buffer
      const fileBuffer = req.file.buffer;

      // buat path
      const timestamp = new Date().getTime();
      const path = `/book/${timestamp}-${req.file.originalname}`;

      // proses upload file
      const fileUrl = await uploadFileToSupabase(path, fileBuffer);

      // isi variabel cover dengan url
      cover = fileUrl;
    }

    // simpan data ke database
    const book = await prisma.book.create({
      data: {
        title,
        author,
        price,
        cover: cover || null,
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
        message: "Data buku tidak ditemukan",
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

const updateBookByIdController = async (req, res) => {
  try {
    // ambil id dari req.params
    const id = parseInt(req.params.id);

    // validasi jika client tidak mengirimkan id
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Id buku tidak boleh kosong",
      });
    }

    // cek di database
    const book = await prisma.book.findUnique({
      where: {
        id,
      },
    });

    // validasi: jika data buku tidak ada
    if (!book) {
      return res.status(404).json({
        status: "error",
        message: "Data buku tidak ditemukan",
      });
    }

    // ambil data dari req.body
    const { title, author, price } = req.body;

    const updatedBook = await prisma.book.update({
      where: {
        id,
      },
      data: {
        title: title ? title : book.title,
        author: author ? author : book.author,
        price: price ? price : book.price,
      },
    });

    return res.json({
      status: "success",
      message: "Berhasil mengupdate buku",
      bookId: updatedBook.id,
    });
  } catch (error) {
    // berikan response error
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const deleteBookByIdController = async (req, res) => {
  try {
    // ambil id dari req.params
    const id = parseInt(req.params.id);

    // validasi: jika tidak mengirimkan id
    if (!id) {
      return res.status(400).json({
        status: "error",
        message: "Id buku tidak boleh kosong",
      });
    }

    // cek id di db
    const book = await prisma.book.findUnique({
      where: {
        id,
      },
    });

    // validasi: jika data buku tidak ada
    if (!book) {
      return res.status(404).json({
        status: "error",
        message: "Buku tidak ditemukan",
      });
    }

    // proses hapus buku
    const deletedBook = await prisma.book.delete({
      where: {
        id,
      },
    });

    return res.json({
      status: "error",
      message: "Berhasil menghapus buku",
      bookId: deletedBook.id,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const getUrlImages = async (req, res) => {
  try {
    const { data } = supabase.storage
      .from("images")
      .getPublicUrl("book/1710138105884-jadwal penelitian.png", {
        // download: true,
      });

    return res.json({
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export {
  addBookController,
  getBookController,
  getBookByIdController,
  updateBookByIdController,
  deleteBookByIdController,
  getUrlImages,
};
