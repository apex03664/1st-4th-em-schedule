import React, { useState } from "react";
import rocket from "./rocket.json"
import { useEffect } from "react";
import axios from "axios";

import Lottie from "lottie-react";
const RegistrationForm = ({
  form,
  setForm,
  selectedDate,
  selectedTime,
  getOneHourLater,
  setShowForm,
  handleSubmit,
  handleChange,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await handleSubmit(e);
    } catch (err) {
      setErrorMessage("❌ Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const detectLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/reverse`,
              {
                params: {
                  format: "json",
                  lat: latitude,
                  lon: longitude,
                },
              }
            );
            const { address } = response.data;
            const city = address.city || address.town || address.village || "";
            const state = address.state || "";
            const locationString = `${city}, ${state}`;
            setForm((prevForm) => ({ ...prevForm, location: locationString }));
          } catch (error) {
            console.error("Error fetching location:", error);
            alert("❌ Couldn't detect location. Please try again.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("❌ Location access denied. Please allow GPS or try again.");
        }
      );
    } else {
      alert("❌ Geolocation not supported by your browser.");
    }
  };

  useEffect(() => {
    if (!form.location) {
      detectLocation();
    }
  }, []);


  return (
    <form
      onSubmit={onSubmit}
      className="col-span-3 datetime-container-e  border border-gray-700 rounded-2xl bg-black text-white rounded-none md:rounded-r-2xl p-6 space-y-6 transition-all relative"
    >
      {isSubmitting && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-[9999]">
          <Lottie animationData={rocket} style={{ width: 500 }} />
          <div className="text-white text-lg font-semibold mt-4">
            Booking in progress...
          </div>
        </div>
      )}

      <h3 className="text-xl font-bold mb-4">Registration</h3>

      <div className="flex items-center gap-4">
        <div className="bg-white text-black font-bold px-3 py-2 rounded-lg text-center">
          <div className="text-sm leading-none">
            {selectedDate
              ?.toLocaleString("en-US", { month: "short" })
              .toUpperCase()}
          </div>
          <div className="text-2xl">{selectedDate?.getDate()}</div>
        </div>
        <div>
          <div className="font-medium">
            {selectedDate?.toLocaleDateString("en-GB", {
              weekday: "long",
              day: "2-digit",
              month: "long",
            })}
          </div>
          <div className="text-sm text-gray-400">
            {selectedTime}  (GMT+5:30)
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="text-red-500 font-semibold bg-red-100 bg-opacity-10 p-2 rounded">
          {errorMessage}
        </div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block font-semibold mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-700 rounded bg-black text-white focus:outline-none"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block font-semibold mb-1">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-700 rounded bg-black text-white focus:outline-none"
          />
        </div>

        {/* Mobile */}
        <div>
          <label className="block font-semibold mb-1">
            Mobile number <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <select
              required
              className="w-1/3 px-3 py-2 border border-gray-700 bg-black text-white rounded"
              value={form.countryCode || "+91"}
              onChange={(e) =>
                setForm({ ...form, countryCode: e.target.value })
              }
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+971">+971</option>
            </select>
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-2/3 px-4 py-2 border border-gray-700 rounded bg-black text-white focus:outline-none"
            />
          </div>
        </div>
        {/* Batch No */}
        <div>
          <label className="block font-semibold mb-1">
            Batch No <span className="text-red-500">*</span>
          </label>
          <select
            name="batchNo"
            required
            value={form.batchNo }
            onChange={(e) => setForm({ ...form, batchNo: e.target.value })}
            className="w-full px-4 py-2 border border-gray-700 rounded bg-black text-white focus:outline-none"
          >
            <option value="" disabled>
              Select Batch No
            </option>
            <option value="Batch 7">Batch 7</option>
            <option value="Batch 6">Batch 6</option>
           
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold mb-1">
            What is your City & State Name? <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              name="location"
              placeholder="City & State"
              value={form.location || ""}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-700 rounded bg-black text-white focus:outline-none"
            />
            <button
              type="button"
              onClick={detectLocation}
              className="whitespace-nowrap px-3 py-2 bg-gray-800 border border-gray-600 rounded text-white hover:bg-gray-700"
            >
             Detect
            </button>
          </div>
        </div>


        {/* Grade */}
        <div>
          <label className="block font-semibold mb-2">
            GRADE of Student <span className="text-red-500">*</span>
          </label>
          <div className="space-y-1">
            {["1ST", "2ND", "3RD", "4TH" ].map(
              (g) => (
                <label key={g} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="grade"
                    value={g}
                    checked={form.grade === g}
                    onChange={(e) =>
                      setForm({ ...form, grade: e.target.value })
                    }
                    className="form-radio text-blue-600 focus:ring-blue-500"
                  />
                  <span>{g}</span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Parent Confirmation */}
        <div>
          <label className="block font-semibold mb-1">
            Please confirm that both parents are available with student for this
            Family Counselling session! <span className="text-red-500">*</span>
          </label>
          <label className="flex items-center gap-2 mt-1">
            <input
              type="checkbox"
              required
              checked={form.parentConfirmed || false}
              onChange={(e) =>
                setForm({ ...form, parentConfirmed: e.target.checked })
              }
              className="form-checkbox text-green-600 focus:ring-green-500"
            />
            <span>Yes</span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-5 py-2 border border-gray-600 rounded hover:bg-gray-800 text-white"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={
              !form.name ||
              !form.location ||
              !form.grade ||
              !form.parentConfirmed ||
              isSubmitting
            }
            className={`px-6 py-2 rounded font-semibold ${!form.name ||
              !form.location ||
              !form.grade ||
              !form.parentConfirmed ||
              isSubmitting
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
          >
            ✅ Confirm Booking
          </button>
        </div>
      </div>
    </form>
  );
};

export default RegistrationForm;
