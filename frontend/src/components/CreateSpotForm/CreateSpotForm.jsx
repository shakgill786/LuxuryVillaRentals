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
    lat: '', // Renamed latitude to lat
    lng: '', // Renamed longitude to lng
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

    const { country, lat, lng, address, city, state, description, name, price, previewImage } = formData;

    // Validation
    const newErrors = {};
    if (!country) newErrors.country = 'Country is required';
    if (!lat || isNaN(Number(lat)) || Number(lat) < -90 || Number(lat) > 90) {
      newErrors.lat = 'Latitude must be a number between -90 and 90';
    }
    if (!lng || isNaN(Number(lng)) || Number(lng) < -180 || Number(lng) > 180) {
      newErrors.lng = 'Longitude must be a number between -180 and 180';
    }
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
          lat: parseFloat(lat), // Ensure lat is a float
          lng: parseFloat(lng), // Ensure lng is a float
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
        lat: '',
        lng: '',
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
              name="lat" // Renamed to match backend
              value={formData.lat}
              onChange={handleChange}
              placeholder="Latitude"
            />
            {errors.lat && <p className="error">{errors.lat}</p>}
          </label>
          <span className="comma">,</span>
          <label className="longitude-input">
            Longitude
            <input
              type="text"
              name="lng" // Renamed to match backend
              value={formData.lng}
              onChange={handleChange}
              placeholder="Longitude"
            />
            {errors.lng && <p className="error">{errors.lng}</p>}
          </label>
        </div>

        {/* Description Section */}
        <h2>Describe your place to guests</h2>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Please write at least 30 characters"
        ></textarea>
        {errors.description && <p className="error">{errors.description}</p>}

        {/* Title Section */}
        <h2>Create a title for your spot</h2>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name of your spot"
        />
        {errors.name && <p className="error">{errors.name}</p>}

        {/* Price Section */}
        <h2>Set a base price for your spot</h2>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price per night (USD)"
        />
        {errors.price && <p className="error">{errors.price}</p>}

        {/* Images Section */}
        <h2>Liven up your spot with photos</h2>
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