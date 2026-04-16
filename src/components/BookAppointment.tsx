"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { X } from "lucide-react";

interface BookAppointmentProps {
  onClose?: () => void;
  cmsData?: any;
}

export default function BookAppointment({ onClose, cmsData }: BookAppointmentProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    matter: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch("/api/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body?.error || "Unable to submit booking request");
      }

      setSuccessMessage("Booking request submitted successfully. Check email confirmation soon.");
      setFormData({ name: "", email: "", phone: "", date: "", matter: "", message: "" });
      if (onClose) setTimeout(onClose, 2000);
    } catch (error) {
      console.error("Error submitting booking form:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      className="py-16 bg-gray-50 dark:bg-gray-900"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {cmsData?.bookingTitle || "Book Your Free Evaluation"}
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {cmsData?.bookingSubtitle || "Schedule a consultation with our experienced legal professionals"}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-4 p-2 border border-gray-300 rounded hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-md space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {/* Success Message */}
          {successMessage && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-300 font-medium">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-300 font-medium">{errorMessage}</p>
            </div>
          )}
          {/* Name and Email Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Phone and Date Row */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="+231 XXX XXX XXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Legal Matter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Legal Matter *
            </label>
            <select
              name="matter"
              value={formData.matter}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select your legal matter</option>
              <option value="corporate">Corporate & Commercial Law</option>
              <option value="banking">Banking & Finance</option>
              <option value="litigation">Commercial & Civil Dispute Litigation</option>
              <option value="real-estate">Real Estate & Conveyance</option>
              <option value="projects">Projects and Infrastructure</option>
              <option value="energy">Energy, Oil, Gas, and Mining</option>
              <option value="mergers">Mergers and Acquisitions</option>
              <option value="labor">Labor and Labor-Related Matters</option>
              <option value="tax">Tax and Related Matters</option>
              <option value="telecom">Telecommunications</option>
              <option value="business-establishment">Business Vehicle Establishment</option>
              <option value="consultancy">Legal Consultancy and Administrative Representation</option>
              <option value="contracts">Drafting and Review of Contracts</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Brief Description of Your Case
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Please provide details about your legal matter..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Submitting..." : "Book Evaluation"}
            </button>
          </div>
        </motion.form>
      </div>
    </motion.section>
  );
}
