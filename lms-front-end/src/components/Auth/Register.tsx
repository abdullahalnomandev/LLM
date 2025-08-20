"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormHeader from "../UI/FormHeader";
import { signUpUser } from "@/services/auth.Service";

const formFields = [
  {
    name: "name",
    label: "Full Name",
    type: "text",
    placeholder: "Enter your full name",
    required: true,
  },
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

const Register = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    formFields.forEach((field) => {
      const value = (formData as any)[field.name];
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
      // Send dynamic formData inside "user" key
      await signUpUser({
        user: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
      });
      router.push("/auth/login"); // redirect to login after registration
    } catch (error: any) {
      setErrors({ submit: error.message || "Registration failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 py-6">
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden w-full max-w-md mx-4">
        <FormHeader
          title="Create an Account"
          description="Sign up to access your dashboard"
        />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {formFields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>
              <input
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={(formData as any)[field.name]}
                onChange={handleChange}
                disabled={isLoading}
                className={`block w-full border rounded-xl px-4 py-3 text-base focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  errors[field.name] ? "border-red-500" : "border-gray-300"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
              )}
            </div>
          ))}

          {errors.submit && (
            <p className="text-red-500 text-sm text-center">{errors.submit}</p>
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
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-sm pb-4 mt-2">
          Already have an account?{" "}
          <a
            href="/auth/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
