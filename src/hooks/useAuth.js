const handleLogin = async (credentials) => {
  try {
    console.log("📤 Login request:", credentials);
    const response = await authAPI.login(credentials);
    console.log("✅ Login success:", response.data);

    const token = response.data.access || response.data.token;
    if (token) {
      localStorage.setItem("token", token);
      navigate("/"); 
    } else {
      alert("Không nhận được token từ server!");
    }
  } catch (error) {
    console.error("❌ Login error:", error.response?.data || error.message);
    alert(
      "Đăng nhập thất bại: " +
        (error.response?.data?.detail ||
          error.response?.data?.error ||
          "Sai mật khẩu hoặc tài khoản")
    );
  }
};
