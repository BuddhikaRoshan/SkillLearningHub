import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { TextField, Button, Checkbox, FormControlLabel, CircularProgress } from "@mui/material";
import userApi from "../api/userApi";
import BubbleBackground from "./BubbleBackground"; // Correct the import path

const RegisterPage = () => {
  const navigate = useNavigate();
  const tenYearsAgo = new Date();
  tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    profileImageUrl:
      "https://t4.ftcdn.net/jpg/02/15/84/43/360_F_215844325_ttX9YiIIyeaR7Ne6EaLLjMAmy4GvPC69.jpg",
    username: "",
    email: "",
    contactNumber: "",
    password: "",
    confirmPassword: "",
    publicStatus: true,
    gender: "",
    address: "",
    birthday: tenYearsAgo.toISOString().split("T")[0], // Format: yyyy-mm-dd
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.firstName)) {
      newErrors.firstName = "First name should contain only letters";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.lastName)) {
      newErrors.lastName = "Last name should contain only letters";
    }

    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Contact number must be 10 digits";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);

      try {
        const { confirmPassword, ...dataToSend } = formData;
        const response = await userApi.register(dataToSend);

        alert("Registration successful! Please login.");
        navigate("/login");
      } catch (error) {
        console.error("Registration failed:", error);
        setErrors({
          submit:
            error.response?.data?.message ||
            "Registration failed. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <BubbleBackground /> {/* Add the BubbleBackground component here */}

      <div className="sm:mx-auto sm:w-full sm:max-w-4xl relative z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-5xl relative z-10">
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* First Name */}
              <div>
                <TextField
                  id="firstName"
                  label="First Name"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                />
              </div>

              {/* Last Name */}
              <div>
                <TextField
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                />
              </div>

              {/* Username */}
              <div>
                <TextField
                  id="username"
                  label="Username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.username}
                  helperText={errors.username}
                />
              </div>

              {/* Email */}
              <div>
                <TextField
                  id="email"
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </div>

              {/* Contact Number */}
              <div>
                <TextField
                  id="contactNumber"
                  label="Contact Number"
                  name="contactNumber"
                  type="text"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.contactNumber}
                  helperText={errors.contactNumber}
                />
              </div>

              {/* Gender */}
              <div>
                <TextField
                  id="gender"
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  select
                  fullWidth
                >
                  <option value="">Select</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </TextField>
              </div>

              {/* Date of Birth */}
              <div>
                <TextField
                  id="birthday"
                  label="Date of Birth"
                  name="birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={handleChange}
                  fullWidth
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <TextField
                  id="address"
                  label="Address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                />
              </div>
            </div>

            {/* Bio */}
            <div>
              <TextField
                id="bio"
                label="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                fullWidth
                multiline
                rows={3}
              />
            </div>

            {/* Password */}
            <div>
              <TextField
                id="password"
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                error={!!errors.password}
                helperText={errors.password}
              />
            </div>

            {/* Confirm Password */}
            <div>
              <TextField
                id="confirmPassword"
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </div>

            {/* Public Status */}
            <div className="flex items-center">
              <FormControlLabel
                control={
                  <Checkbox
                    id="publicStatus"
                    name="publicStatus"
                    checked={formData.publicStatus}
                    onChange={handleChange}
                    color="primary"
                  />
                }
                label="Make my profile public"
              />
            </div>

            {/* Submit Button */}
            <div>
            <Button
  type="submit"
  variant="contained"
  fullWidth
  disabled={isSubmitting}
  style={{ backgroundColor: "#328E6E", color: "#ffffff" }}
>
  {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Register"}
</Button>


              {errors.submit && (
                <p className="mt-2 text-center text-sm text-red-600">
                  {errors.submit}
                </p>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              style={{
                color: "#1b5e20",
                fontWeight: "500",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
