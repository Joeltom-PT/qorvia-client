import React, {
  useState,
  ChangeEvent,
  FormEvent,
  FocusEvent,
  useEffect,
} from "react";
import OrderSummaryCard, { TicketSelected } from "./OrderSummaryCard";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";
import { bookingFromSubmit } from "../../redux/action/userActions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const validateField = (name: string, value: string): string => {
  switch (name) {
    case "userName":
      return value.trim() ? "" : "Username is required";
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) return "Email is required";
      if (!emailRegex.test(value)) return "Invalid email format";
      return "";
    case "address":
      return value.trim() ? "" : "Address is required";
    case "country":
      return value ? "" : "Country is required";
    case "state":
      return value.trim() ? "" : "State is required";
    case "city":
      return value.trim() ? "" : "City is required";
    case "zipCode":
      const zipRegex = /^[0-9]{4,6}$/;
      if (!value.trim()) return "Zip/Post code is required";
      if (!zipRegex.test(value)) return "Invalid zip/post code format";
      return "";
    default:
      return "";
  }
};

interface FormData {
  userName: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  eventId: string;
  ticketOptions: string; 
}

interface Errors {
  [key: string]: string;
}

interface Touched {
  [key: string]: boolean;
}

interface OrderConfirmationFormProps {
  eventId: string;
  isOnline: boolean;
  ticketOptions: TicketSelected[] | null;
}

const OrderConfirmationForm: React.FC<OrderConfirmationFormProps> = ({ eventId, isOnline, ticketOptions }) => {
  const [formData, setFormData] = useState<FormData>({
    userName: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    zipCode: "",
    eventId: eventId,
    ticketOptions: ticketOptions ? JSON.stringify(ticketOptions) : "", 
  });

  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Touched>({});
  const [paymentLoading, setPaymentLoading] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (touched[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, value),
      }));
    }
  };

  const handleCountryChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      country: val,
    }));

    if (touched.country) {
      setErrors((prev) => ({
        ...prev,
        country: validateField("country", val),
      }));
    }
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key as keyof FormData]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(
      Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {})
    );

    if (validateForm()) {
      const finalTicketOptions = formData.ticketOptions
        ? JSON.parse(formData.ticketOptions)
        : [];

     const finalFormData = {
      ...formData,
      ticketOptions: finalTicketOptions, 
    }
      
    try {
      setPaymentLoading(true)
      const response = await dispatch(bookingFromSubmit(finalFormData)).unwrap();
      if(response.isFree && eventId == response.eventId){
        
        const bookingDetails = {bookingId : response.bookingId, isFree : true}
        navigate("/event/booking/status", {state : bookingDetails , replace : true})

      } else if (eventId == response.eventId) {

        if (response.paymentLink.startsWith("http")) {
          window.location.href = response.paymentLink; 
        }

      }
    } catch (error) {
        toast.error("Something went wrong")
    } finally {
      setTimeout(() => {
        setPaymentLoading(false);
     }, 1000);
    
    }

    } else {
      console.log("Form has errors");
    }
  };

  useEffect(() => {
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        userName: user.username || "",
        email: user.email || "",
        address: user.address || "",
      }));
    }
  }, [user]);

  const inputStyle =
    "w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500";
  const errorStyle = "text-red-500 text-sm mt-1";
  const labelStyle = "block text-gray-700 text-sm font-bold mb-2";

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Order Confirmation</h1>

        <div className="flex flex-col lg:flex-row lg:space-x-6">
          <OrderSummaryCard eventId={eventId} isOnline={isOnline} ticketOptions={ticketOptions} />

          <div className="hidden lg:block w-px bg-blue-800 mx-6"></div>

          <div className="p-6 flex-grow">
            <h2 className="text-xl font-semibold mb-4">Billing Information</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div>
                <label htmlFor="userName" className={labelStyle}>
                  Username*
                </label>
                <input
                  type="text"
                  id="userName"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={paymentLoading}
                  className={`${inputStyle} ${errors.userName ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.userName && touched.userName && <p className={errorStyle}>{errors.userName}</p>}
              </div>

              {/* Email Input */}
              <div>
                <label htmlFor="email" className={labelStyle}>
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={paymentLoading}
                  onBlur={handleBlur}
                  className={`${inputStyle} ${errors.email ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.email && touched.email && <p className={errorStyle}>{errors.email}</p>}
              </div>

              {/* Address Input */}
              <div>
                <label htmlFor="address" className={labelStyle}>
                  Address*
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  disabled={paymentLoading}
                  onBlur={handleBlur}
                  className={`${inputStyle} ${errors.address ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.address && touched.address && <p className={errorStyle}>{errors.address}</p>}
              </div>

              {/* Country Dropdown */}
              <div>
                <label htmlFor="country" className={labelStyle}>
                  Country*
                </label>
                <CountryDropdown
                  value={formData.country}
                  onChange={handleCountryChange}
                  disabled={paymentLoading}
                  classes={`${inputStyle} ${errors.country ? "border-red-500" : "border-gray-300"}`}
                  priorityOptions={["USA", "CAN"]}
                />
                {errors.country && touched.country && <p className={errorStyle}>{errors.country}</p>}
              </div>

              {/* State and City Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="state" className={labelStyle}>
                    State*
                  </label>
                  <RegionDropdown
                    country={formData.country}
                    value={formData.state}
                    disabled={paymentLoading}
                    onChange={(val) => {
                      setFormData((prev) => ({ ...prev, state: val }));
                      setErrors((prev) => ({
                        ...prev,
                        state: validateField("state", val),
                      }));
                      setTouched((prev) => ({ ...prev, state: true }));
                    }}
                    classes={`${inputStyle} ${errors.state ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.state && touched.state && <p className={errorStyle}>{errors.state}</p>}
                </div>

                <div>
                  <label htmlFor="city" className={labelStyle}>
                    City/Suburb*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    disabled={paymentLoading}
                    onBlur={handleBlur}
                    className={`${inputStyle} ${errors.city ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.city && touched.city && <p className={errorStyle}>{errors.city}</p>}
                </div>
              </div>

              {/* Zip/Post Code Input */}
              <div>
                <label htmlFor="zipCode" className={labelStyle}>
                  Zip/Post Code*
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  disabled={paymentLoading}
                  onBlur={handleBlur}
                  className={`${inputStyle} ${errors.zipCode ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.zipCode && touched.zipCode && <p className={errorStyle}>{errors.zipCode}</p>}
              </div>

              {/* Hidden Fields */}
              <input type="hidden" name="eventId" value={formData.eventId} />
              <input type="hidden" name="ticketOptions" value={formData.ticketOptions} />

              <button
                type="submit"
                disabled={paymentLoading}
                className="w-full py-2 px-4 bg-blue-900 text-white rounded-[5px] hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-700"
              >
               {paymentLoading ? "Proccessing.." : "Place Order"} 
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationForm;
