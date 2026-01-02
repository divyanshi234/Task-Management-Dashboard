
import { LogIn, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Inputwrapper, BUTTON_CLASSES } from '../assets/dummy';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const INITIAL_FORM = { email: "", password: "" };

function Login({ onSubmit, onSwitchMode }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const url = "http://localhost:4000";

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token) return;

    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${url}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (data.success) {
          onSubmit?.({ token, userId, ...data.user });
          toast.success("Session restored. Redirecting...");
          navigate('/');
        } else {
          localStorage.clear();
        }
      } catch {
        localStorage.clear();
      }
    };

    fetchUser();
  }, []); // ✅ Empty dependencies

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rememberMe) {
      toast.error('You must enable "Remember Me" to login');
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(`${url}/api/user/login`, formData);
      if (!data.token) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      setFormData(INITIAL_FORM);

      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user });
      toast.success("Login successful!");
    } catch (error) {
      const msg = error.response?.data?.message || error.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchMode = () => {
    toast.dismiss();
    onSwitchMode?.();
  };

  const fields = [
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    { name: "password", type: showPassword ? "text" : "password", icon: Lock, isPassword: true },
  ];

  return (
    <div className="max-w-md bg-white w-full shadow-lg border border-purple-100 rounded-xl p-8">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <div className="mb-6 text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-full mx-auto flex items-center justify-center mb-4">
          <LogIn className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
        <p className="text-gray-500 text-sm mt-1">Sign in to continue to TaskZone</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
          <div key={name} className={Inputwrapper}>
            <Icon className="text-purple-500 w-5 h-5" />
            <input
              type={type}
              placeholder={placeholder}
              value={formData[name]}
              onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
              className="w-full focus:outline-none text-sm text-gray-700"
              required
            />

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-2 text-gray-500 hover:text-purple-500 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            )}
          </div>
        ))}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
            className="h-4 w-4 text-purple-500 focus:ring-purple-400 border-gray-300 rounded"
            required
          />
          <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
            Remember Me
          </label>
        </div>

        <button type="submit" className={BUTTON_CLASSES} disabled={loading}>
          {loading ? "Logging in..." : (<><LogIn className="w-4 h-4" /> Login</>)}
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <button
          type="button"
          className="text-purple-600 hover:text-purple-700 hover:underline font-medium transition-colors"
          onClick={handleSwitchMode}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;
