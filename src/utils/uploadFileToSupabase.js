import supabase from "../config/supabaseConfig.js";
// https://www.youtube.com/watch?v=21gOL_PIfAA 1:58:52

const uploadFileToSupabase = async (path, fileBuffer) => {
  try {
    // Upload gambar ke Supabase Storage
    const { data, error } = await supabase.storage
      .from("images")
      .upload(path, fileBuffer);

    if (error) {
      throw new Error(error.message);
    }

    // Ambil URL gambar yang baru diupload
    const fileUrl = `https://xoravptyifdtjtpojagh.supabase.co/storage/v1/object/public/${data.fullPath}`;
    console.log(data);

    return fileUrl;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { uploadFileToSupabase };
