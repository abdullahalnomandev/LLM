"use client";

import { useState } from "react";
import FormHeader from "../UI/FormHeader";
import { loginUser } from "@/services/auth.Service";

const formFields = [
  {
    name: "email",
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
];

const Login = () => {
   const [searchParams] = useState(() => new URLSearchParams(
     typeof window !== 'undefined' ? window.location.search : ''
   ));
   const callbackUrl = searchParams.get("callbackUrl");
  const [formData, setFormData] = useState<Record<string, any>>({
    email: "user@gmail.com", // default user email
    password: "user123", // default user password
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    formFields.forEach((field) => {
      const value = formData[field.name];
      if (field.required && (!value || value.toString().trim() === "")) {
        newErrors[field.name] = `${field.label} is required`;
      }
      if (field.name === "email" && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.name] = "Please enter a valid email address";
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    try {
       await loginUser({
        email: formData.email,
        password: formData.password,
      },{
        callbackUrl: callbackUrl || '/'
      });

    } catch  {
      // setErrors({ submit: error.message || "Login failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center my-2 justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full max-w-lg mx-4">
        <FormHeader
          title="Login to Your Account"
          description="Enter your credentials to access the dashboard"
        />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {formFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}{" "}
                {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                disabled={isLoading}
                className={`block w-full border rounded-xl px-4 py-3 text-base focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors[field.name] ? "border-red-500" : "border-gray-300"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}

          {errors.submit && (
            <p className="text-red-500 text-sm">{errors.submit}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`block w-full text-white text-base font-semibold py-3 rounded-xl focus:ring-1 focus:ring-blue-500 focus:ring-offset-1 transition ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm pb-4">
          Don&apos;t have an account?{" "}
          <a
            href="/auth/register"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Register here
          </a>
        </p>
        {/* Demo Credentials */}
        <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
          <h3 className="font-bold text-gray-700 mb-2">Demo Credentials</h3>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium"> User</p>
                <div className="flex gap-2">
                  <p>Email:</p>
                  <span className="font-mono">user@gmail.com</span>
                </div>
                <div className="flex gap-2">
                  <p>Password:</p>
                  <span className="font-mono">user123</span>
                </div>
              </div>
              <div>
                <p className="font-medium"> Admin</p>
                <div className="flex gap-2">
                  <p>Email:</p>
                  <span className="font-mono">admin@gmail.com</span>
                </div>
                <div className="flex gap-2">
                  <p>Password:</p>
                  <span className="font-mono">admin123</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
