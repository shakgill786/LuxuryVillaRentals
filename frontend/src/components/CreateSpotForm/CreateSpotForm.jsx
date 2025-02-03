import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createSpotThunk } from "../../store/spots";
import "./CreateSpotForm.css";

function CreateSpotForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    country: "",
    address: "",
    city: "",
    state: "",
    lat: "",
    lng: "",
    description: "",
    name: "",
    price: "",
    previewImage: "",
  });

  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e, index) => {
    const updatedUrls = [...imageUrls];
    updatedUrls[index] = e.target.value;
    setImageUrls(updatedUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setIsSubmitting(true);

    const { country, address, city, state, lat, lng, description, name, price, previewImage } = formData;

    const newErrors = {};
    if (!country) newErrors.country = "Country is required";
    if (!address) newErrors.address = "Street address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (!lat || isNaN(lat) || lat < -90 || lat > 90) newErrors.lat = "Latitude must be between -90 and 90";
    if (!lng || isNaN(lng) || lng < -180 || lng > 180) newErrors.lng = "Longitude must be between -180 and 180";
    if (!description || description.length < 30) newErrors.description = "Description needs at least 30 characters";
    if (!name) newErrors.name = "Name of your spot is required";
    if (!price || price <= 0) newErrors.price = "Price per night must be greater than 0";
    if (!previewImage) newErrors.previewImage = "Preview Image URL is required";

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const newSpot = await dispatch(
        createSpotThunk({
          ...formData,
          images: [previewImage, ...imageUrls.filter((url) => url.trim() !== "")],
        })
      );
      navigate(`/spots/${newSpot.id}`);
    } catch (error) {
      console.error("Error creating spot:", error);
      setFormErrors({ api: "Failed to create spot. Please try again." });
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      setFormData({
        country: "",
        address: "",
        city: "",
        state: "",
        lat: "",
        lng: "",
        description: "",
        name: "",
        price: "",
        previewImage: "",
      });
      setImageUrls(["", "", "", ""]);
      setFormErrors({});
    };
  }, []);

  return (
    <div className="create-spot-form">
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit}>

        {/* Section 1: Location */}
        <h2>Where&apos;s your place located?</h2>
        <p>Guests will only get your exact address once they&apos;ve booked a reservation.</p>

        <label>
          Country
          <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
          {formErrors.country && <p className="error">{formErrors.country}</p>}
        </label>

        <label>
          Street Address
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" />
          {formErrors.address && <p className="error">{formErrors.address}</p>}
        </label>

        <div className="location-inputs">
          <label>
            City
            <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
            {formErrors.city && <p className="error">{formErrors.city}</p>}
          </label>

          <label>
            State
            <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
            {formErrors.state && <p className="error">{formErrors.state}</p>}
          </label>
        </div>

        <div className="location-inputs">
          <label>
            Latitude
            <input type="number" name="lat" value={formData.lat} onChange={handleChange} placeholder="Latitude" />
            {formErrors.lat && <p className="error">{formErrors.lat}</p>}
          </label>

          <label>
            Longitude
            <input type="number" name="lng" value={formData.lng} onChange={handleChange} placeholder="Longitude" />
            {formErrors.lng && <p className="error">{formErrors.lng}</p>}
          </label>
        </div>

        {/* Section 2: Description */}
        <h2>Describe your place to guests</h2>
        <p>
          Mention the best features of your space, any special amenities like fast Wi-Fi or parking,
          and what you love about the neighborhood.
        </p>
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Please write at least 30 characters"></textarea>
        {formErrors.description && <p className="error">{formErrors.description}</p>}

        {/* Section 3: Title */}
        <h2>Create a title for your spot</h2>
        <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name of your spot" />
        {formErrors.name && <p className="error">{formErrors.name}</p>}

        {/* Section 4: Price */}
        <h2>Set a base price for your spot</h2>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price per night (USD)" />
        {formErrors.price && <p className="error">{formErrors.price}</p>}

        {/* Section 5: Images */}
        <h2>Liven up your spot with photos</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>
        <input type="text" name="previewImage" value={formData.previewImage} onChange={handleChange} placeholder="Preview Image URL" />
        {formErrors.previewImage && <p className="error">{formErrors.previewImage}</p>}

        {imageUrls.map((url, index) => (
          <input key={index} type="text" value={url} onChange={(e) => handleImageChange(e, index)} placeholder={`Image URL ${index + 1}`} />
        ))}

        {formErrors.api && <p className="error">{formErrors.api}</p>}

        <button type="submit" disabled={isSubmitting}>{isSubmitting ? "Creating..." : "Create a Spot"}</button>
      </form>
    </div>
  );
}

export default CreateSpotForm;