// CreateSpotForm.jsx
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSpotThunk } from '../../store/spots';
import './CreateSpotForm.css';

function CreateSpotForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    country: '',
    latitude: '',
    longitude: '',
    address: '',
    city: '',
    state: '',
    description: '',
    name: '',
    price: '',
    previewImage: '',
  });

  const [imageUrls, setImageUrls] = useState(['', '', '', '']);
  const [errors, setErrors] = useState({});

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

    const { country, latitude, longitude, address, city, state, description, name, price, previewImage } = formData;

    // Validation
    const newErrors = {};
    if (!country) newErrors.country = 'Country is required';
    if (!latitude || isNaN(Number(latitude))) newErrors.latitude = 'Latitude is required and must be a number';
    if (!longitude || isNaN(Number(longitude))) newErrors.longitude = 'Longitude is required and must be a number';
    if (!address) newErrors.address = 'Street address is required';
    if (!city) newErrors.city = 'City is required';
    if (!state) newErrors.state = 'State is required';
    if (!description || description.length < 30) newErrors.description = 'Description needs 30 or more characters';
    if (!name) newErrors.name = 'Name of your spot is required';
    if (!price || price <= 0) newErrors.price = 'Price per night is required';
    if (!previewImage) newErrors.previewImage = 'Preview Image URL is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    try {
      const newSpot = await dispatch(
        createSpotThunk({
          ...formData,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          images: imageUrls.filter(Boolean),
        })
      );
      navigate(`/spots/${newSpot.id}`);
    } catch (error) {
      setErrors({ api: 'Failed to create spot. Please try again.' });
    }
  };

  useEffect(() => {
    return () => {
      setFormData({
        country: '',
        latitude: '',
        longitude: '',
        address: '',
        city: '',
        state: '',
        description: '',
        name: '',
        price: '',
        previewImage: '',
      });
      setImageUrls(['', '', '', '']);
      setErrors({});
    };
  }, []);

  return (
    <div className="create-spot-form">
      <h1>Create a New Spot</h1>
      <form onSubmit={handleSubmit}>
        {/* Location Section */}
        <h2>Where&apos;s your place located?</h2>
        <p>Guests will only get your exact address once they booked a reservation.</p>
        <label>
          Country
          <input type="text" name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
          {errors.country && <p className="error">{errors.country}</p>}
        </label>
        <label>
          Street Address
          <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" />
          {errors.address && <p className="error">{errors.address}</p>}
        </label>
        <div className="location-inputs">
          <label className="city-input">
            City
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
            />
            {errors.city && <p className="error">{errors.city}</p>}
          </label>
          <span className="comma">,</span>
          <label className="state-input">
            State
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
            />
            {errors.state && <p className="error">{errors.state}</p>}
          </label>
        </div>
        <div className="location-inputs">
          <label className="latitude-input">
            Latitude
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              placeholder="Latitude"
            />
            {errors.latitude && <p className="error">{errors.latitude}</p>}
          </label>
          <span className="comma">,</span>
          <label className="longitude-input">
            Longitude
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              placeholder="Longitude"
            />
            {errors.longitude && <p className="error">{errors.longitude}</p>}
          </label>
        </div>

        {/* Description Section */}
        <h2>Describe your place to guests</h2>
        <p>
          Mention the best features of your space, any special amenities like fast wifi or parking,
          and what you love about the neighborhood.
        </p>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Please write at least 30 characters"
        ></textarea>
        {errors.description && <p className="error">{errors.description}</p>}

        {/* Title Section */}
        <h2>Create a title for your spot</h2>
        <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name of your spot" />
        {errors.name && <p className="error">{errors.name}</p>}

{/* Price Section */}
<h2>Set a base price for your spot</h2>
<p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
<div className="price-input-container">
  <input
    type="number"
    name="price"
    value={formData.price}
    onChange={handleChange}
    placeholder="Price per night (USD)"
  />
</div>
{errors.price && <p className="error">{errors.price}</p>}




        {/* Images Section */}
        <h2>Liven up your spot with photos</h2>
        <p>Submit a link to at least one photo to publish your spot.</p>
        <input
          type="text"
          name="previewImage"
          value={formData.previewImage}
          onChange={handleChange}
          placeholder="Preview Image URL"
        />
        {errors.previewImage && <p className="error">{errors.previewImage}</p>}
        {imageUrls.map((url, index) => (
          <input
            key={index}
            type="text"
            value={url}
            onChange={(e) => handleImageChange(e, index)}
            placeholder={`Image URL ${index + 1}`}
          />
        ))}

        {/* Submit Button */}
        {errors.api && <p className="error">{errors.api}</p>}
        <button type="submit">Create a Spot</button>
      </form>
    </div>
  );
}

export default CreateSpotForm;