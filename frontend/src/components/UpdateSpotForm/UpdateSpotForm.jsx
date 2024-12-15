import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchSpotDetails, updateSpotThunk } from "../../store/spots";
import "./UpdateSpotForm.css";

const UpdateSpotForm = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const spot = useSelector((state) => state.spots.singleSpot);

  const [formData, setFormData] = useState({
    country: "",
    lat: "",
    lng: "",
    address: "",
    city: "",
    state: "",
    description: "",
    name: "",
    price: "",
    previewImage: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchSpotDetails(spotId));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching spot details:", error);
        setErrors({ api: "Failed to fetch spot details. Please try again." });
      }
    };

    fetchData();
  }, [dispatch, spotId]);

  useEffect(() => {
    if (spot && !isLoading) {
      setFormData({
        country: spot.country || "",
        lat: spot.lat || "",
        lng: spot.lng || "",
        address: spot.address || "",
        city: spot.city || "",
        state: spot.state || "",
        description: spot.description || "",
        name: spot.name || "",
        price: spot.price || "",
        previewImage: spot.SpotImages?.[0]?.url || "",
      });
    }
  }, [spot, isLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedSpot = {
      ...formData,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
    };

    try {
      await dispatch(updateSpotThunk(spotId, updatedSpot));
      navigate(`/spots/${spotId}`);
    } catch (error) {
      console.error("Error updating spot:", error);
      setErrors({ api: "Failed to update the spot. Please try again." });
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="update-spot-form">
      <h1>Update your Spot</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Country
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
          />
        </label>
        <label>
          Street Address
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </label>
        <div className="row-inputs">
          <label>
            City
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </label>
          <label>
            State
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="row-inputs">
          <label>
            Latitude
            <input
              type="text"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
            />
          </label>
          <label>
            Longitude
            <input
              type="text"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
            />
          </label>
        </div>
        <label>
          Description
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </label>
        <label>
          Name of your spot
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Price per night
          <div className="price-input-container">
            <span className="dollar-sign">$</span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
        </label>
        <label>
          Preview Image URL
          <input
            type="text"
            name="previewImage"
            value={formData.previewImage}
            onChange={handleChange}
          />
        </label>
        {errors.api && <p className="error">{errors.api}</p>}
        <button type="submit">Update your Spot</button>
      </form>
    </div>
  );
};

export default UpdateSpotForm;