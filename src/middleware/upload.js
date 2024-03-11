import multer from "multer";

// file disimpan di penyimpanan sementara
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
