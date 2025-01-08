import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../../redux/store";
import {
  IOfflineEventTickets,
  TicketCategory,
} from "../../../../interfaces/event";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { MoonLoader } from "react-spinners";
import {
  createOfflineEventTicket,
  getOfflineEventTicket,
} from "../../../../redux/action/organizerActions";

const OfflineEventTickets = () => {
  const { id } = useParams<{ id: string }>();
  const [totalTickets, setTotalTickets] = useState("");
  const [ticketCategories, setTicketCategories] = useState<TicketCategory[]>([
    {
      name: "Individual",
      totalTickets: "1",
      price: "",
      discountType: "none",
      discountValue: "",
      description: "",
    },
    {
      name: "Family",
      totalTickets: "5",
      price: "",
      discountType: "none",
      discountValue: "",
      description: "",
    },
    {
      name: "Group",
      totalTickets: "15",
      price: "",
      discountType: "none",
      discountValue: "",
      description: "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({});
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchEventData = async () => {
        try {
          setLoading(true);
          const response = await dispatch(getOfflineEventTicket(id)).unwrap();
          console.log("data is fetched:", response);
          if (response) {
            setTicketCategories(response.categories);
            setTotalTickets(response.totalTickets as unknown as string);
          }
        } catch (error) {
          toast.error("Failed to fetch event information. Please try again.");
          console.error("Error fetching event data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchEventData();
    }
  }, [id, dispatch]);

  const handleInputChange = (
    index: number,
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setTicketCategories((prev) => {
      const updatedCategories = [...prev];
      updatedCategories[index] = { ...updatedCategories[index], [name]: value };
      return updatedCategories;
    });
  };

  const handleAddCategory = () => {
    if (ticketCategories.length < 6) {
      setTicketCategories((prev) => [
        ...prev,
        {
          name: "",
          totalTickets: "",
          price: "",
          discountType: "none",
          discountValue: "",
          description: "",
        },
      ]);
    }
  };

  const handleRemoveCategory = (index: number) => {
    if (ticketCategories.length > 1) {
      setTicketCategories((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrors({});
    let formIsValid = true;
    const newErrors: Partial<Record<string, string>> = {};

    const totalTicketsValue = parseInt(totalTickets);
    if (!totalTickets || isNaN(totalTicketsValue) || totalTicketsValue <= 0) {
      newErrors.totalTickets = "Total tickets must be a positive integer";
      formIsValid = false;
    }

    let categoryTotalTickets = 0;
    ticketCategories.forEach((category, index) => {
      if (!category.name) {
        newErrors[`name${index}`] = "Category name is required";
        formIsValid = false;
      }
      const catTotalTicketsValue = parseInt(category.totalTickets);
      if (
        !category.totalTickets ||
        isNaN(catTotalTicketsValue) ||
        catTotalTicketsValue <= 0
      ) {
        newErrors[`totalTickets${index}`] =
          "Total tickets must be a positive integer";
        formIsValid = false;
      } else if (catTotalTicketsValue > 20) {
        newErrors[`totalTickets${index}`] =
          "Total tickets per category must not exceed 20";
        formIsValid = false;
      } else {
        categoryTotalTickets += catTotalTicketsValue;
      }
      const priceValue = parseFloat(category.price);
      if (!category.price || isNaN(priceValue) || priceValue <= 0) {
        newErrors[`price${index}`] =
          "Ticket price is required and must be a positive number";
        formIsValid = false;
      }
      const discountValue = parseFloat(category.discountValue);
      if (category.discountType !== "none") {
        if (isNaN(discountValue) || discountValue <= 0) {
          newErrors[`discountValue${index}`] =
            "Discount value must be a positive number";
          formIsValid = false;
        } else if (
          category.discountType === "percentage" &&
          discountValue >= 80
        ) {
          newErrors[`discountValue${index}`] =
            "Discount percentage must be less than 80";
          formIsValid = false;
        } else if (
          category.discountType === "fixed" &&
          discountValue >= 0.8 * priceValue
        ) {
          newErrors[`discountValue${index}`] =
            "Fixed discount amount must be less than 80% of the ticket price";
          formIsValid = false;
        }
      }
      const wordCount = category.description.split(/\s+/).length;
      if (!category.description || wordCount > 50) {
        newErrors[`description${index}`] =
          "Description is required and must be less than 50 words";
        formIsValid = false;
      }
    });

    if (categoryTotalTickets > totalTicketsValue) {
      newErrors.totalTickets =
        "Total number of tickets for all categories must not exceed the total tickets";
      formIsValid = false;
    }

    if (!formIsValid) {
      setErrors(newErrors);
      toast.error(
        "Please complete all required fields and ensure the values are valid and meet the specified criteria."
      );
      return;
    }

    const ticketData: IOfflineEventTickets = {
      totalTickets: totalTickets as unknown as number,
      categories: ticketCategories,
    };

    try {
      const response = await dispatch(
        createOfflineEventTicket({ id: id as string, ticket: ticketData })
      ).unwrap();
      navigate(`/organizer/offline-event/settings/${id}`);
      console.log("Ticket created successfully:", response);
    } catch (err) {
      toast.error("Failed to create event ticket. Please try again!");
    }
  };

  const onPrevious = () => {
    navigate(`/organizer/offline-event/location-time/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <MoonLoader color="#1E3A8A" loading={true} size={50} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-white rounded-lg shadow">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Tickets
          </label>
          <input
            type="number"
            name="totalTickets"
            value={totalTickets}
            onChange={(e) => setTotalTickets(e.target.value)}
            placeholder="Enter total tickets available"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.totalTickets && (
            <p className="text-red-500 text-sm">{errors.totalTickets}</p>
          )}
        </div>

        {ticketCategories.map((category, index) => (
          <div
            key={index}
            className="space-y-4 bg-blue-50 p-5 shadow-md border border-blue-700 rounded"
          >
            <div className="flex items-center justify-between">
              <h2
                className="text-lg font-medium text-gray-700 cursor-pointer"
                onClick={() =>
                  setExpandedIndex(expandedIndex === index ? null : index)
                }
              >
                Category {index + 1}: {category.name || "Unnamed"}
              </h2>
              {ticketCategories.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(index)}
                  className="text-white bg-red-500 hover:bg-red-600 p-2 rounded"
                >
                  Remove
                </button>
              )}
            </div>
            {expandedIndex === index && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={category.name}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Enter category name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors[`name${index}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`name${index}`]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total Tickets Available
                  </label>
                  <input
                    type="number"
                    name="totalTickets"
                    value={category.totalTickets}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Enter total number of tickets"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors[`totalTickets${index}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`totalTickets${index}`]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={category.price}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Enter ticket price"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors[`price${index}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`price${index}`]}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    name="discountType"
                    value={category.discountType}
                    onChange={(e) => handleInputChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="none">None</option>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                {category.discountType !== "none" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount Value
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="discountValue"
                      value={category.discountValue}
                      onChange={(e) => handleInputChange(index, e)}
                      placeholder="Enter discount value"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors[`discountValue${index}`] && (
                      <p className="text-red-500 text-sm">
                        {errors[`discountValue${index}`]}
                      </p>
                    )}
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={category.description}
                    onChange={(e) => handleInputChange(index, e)}
                    placeholder="Enter ticket description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors[`description${index}`] && (
                    <p className="text-red-500 text-sm">
                      {errors[`description${index}`]}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        ))}

        {ticketCategories.length < 6 && (
          <button
            type="button"
            onClick={handleAddCategory}
            className="mt-4 w-full py-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md"
          >
            Add Category
          </button>
        )}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="py-2 px-4 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-md"
          >
            Previous
          </button>
          <button
            type="submit"
            className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md"
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

export default OfflineEventTickets;
