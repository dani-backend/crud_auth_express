import supabase from "../config/supabaseConfig.js";

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
      user: data.user,
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

    // simpan token di cookie
    res.cookie("verifyToken", data.session.access_token, {
      httpOnly: true,
      expiresIn: 3600,
    });

    // response success
    return res.status(200).json({
      status: "success",
      message: "Berhasil login",
      user: data.user,
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
    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

export { register, login, logout };
