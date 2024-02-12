import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabseKey);

const register = async (req, res) => {
  try {
    // ambil data req.body
    const { email, password } = req.body;

    // validasi: jika data kurang
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "data email dan password harus diisi",
      });
    }

    // proses register
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    //validasi: jika error
    if (error) {
      return res.status(400).json({
        status: "error",
        message: error.message,
      });
    }

    // response success
    return res.status(201).json({
      status: "success",
      message: "Berhasil registrasi",
      data,
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
    // ambil data req.body
    const { email, password } = req.body;

    // validasi: jika data kurang
    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "data email dan password harus diisi",
      });
    }

    // proses login
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    //validasi: jika error
    if (error) {
      return res.status(401).json({
        status: "error",
        message: error.message,
      });
    }

    // response success
    return res.status(200).json({
      status: "success",
      message: "Berhasil login",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(500).json({ status: "error", message: error.message });
    }

    return res.status(200).json({
      status: "success",
      message: "Berhasil Logout",
    });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
};

export { register, login, logout };
