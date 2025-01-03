'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema for production
}
options.tableName = 'Spots'; // Ensure the correct table name is set in options

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert(
      options,
      [
        {
          ownerId: 1,
          address: '123 Ocean Drive',
          city: 'Los Angeles',
          state: 'California',
          country: 'USA',
          lat: 34.0522,
          lng: -118.2437,
          name: 'Luxury Villa',
          description: `
          Nestled along the breathtaking coastline, this beautiful luxury villa offers an unparalleled retreat 
          with stunning panoramic views of the ocean. Designed to seamlessly blend elegance and comfort, the villa 
          features expansive windows that fill the interiors with natural light and frame the azure waters beyond. 
          Guests can unwind in the spacious living areas adorned with modern decor, or step outside to the private 
          terrace where they can soak in the serene ambiance and enjoy the gentle sea breeze. 

          The villa boasts state-of-the-art amenities, including a gourmet kitchen, luxurious bedrooms with en-suite 
          bathrooms, and an infinity pool that appears to merge with the horizon. Whether enjoying a peaceful morning 
          coffee as the sun rises over the ocean or hosting an evening gathering under the stars, this villa is the 
          epitome of coastal luxury and tranquility, making it a perfect getaway for those seeking an unforgettable 
          experience by the sea.`,          
          price: 500,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 2,
          address: '456 Manhattan Ave',
          city: 'New York',
          state: 'New York',
          country: 'USA',
          lat: 40.7128,
          lng: -74.0060,
          name: 'Modern Apartment',
          description: `
          Situated in the vibrant heart of New York City, this cozy and modern apartment is the perfect urban retreat 
          for those seeking both style and convenience. With sleek, contemporary furnishings and a carefully curated 
          interior, this space offers a blend of comfort and sophistication. Large windows provide stunning cityscape 
          views, filling the apartment with natural light during the day and the glittering lights of the skyline at night. 

          The apartment features an open-concept living area, a fully equipped kitchen with high-end appliances, and a 
          tranquil bedroom designed for restful nights. Nestled just steps away from iconic landmarks, world-class dining, 
          and vibrant nightlife, this apartment allows guests to immerse themselves in the energy of the city while 
          enjoying a private sanctuary. Whether you are a business traveler or a tourist exploring the Big Apple, this 
          modern gem provides an unparalleled New York City experience.`,  
          price: 400,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 3,
          address: '789 Mountain Road',
          city: 'Denver',
          state: 'Colorado',
          country: 'USA',
          lat: 39.7392,
          lng: -104.9903,
          name: 'Rustic Cabin',
          description: `
          Tucked away in the picturesque Colorado wilderness, this rustic cabin offers a serene escape surrounded by 
          majestic mountains and lush forests. Designed with charming wood accents and a warm, inviting interior, the 
          cabin provides a perfect blend of rustic simplicity and modern comforts. Large picture windows frame breathtaking 
          views of the surrounding natural beauty, allowing guests to feel fully immersed in the tranquil environment. 

          The cabin features a cozy living area with a stone fireplace, a well-equipped kitchen for preparing hearty meals, 
          and comfortable bedrooms that exude a rustic charm. Outside, guests can enjoy the fresh mountain air on the 
          spacious deck, complete with seating for outdoor dining and stargazing. Whether hiking nearby trails, fishing in 
          pristine mountain streams, or simply unwinding by the fire with a good book, this cabin offers a peaceful retreat 
          for nature lovers and adventure seekers alike.`,
          price: 300,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 1,
          address: '101 Sunset Blvd',
          city: 'San Diego',
          state: 'California',
          country: 'USA',
          lat: 32.7157,
          lng: -117.1611,
          name: 'Beachfront Bungalow',
          description: `
          Just steps away from the golden sands and sparkling waters of San Diego's iconic beaches, this charming bungalow 
          captures the essence of coastal living. With its classic beachside design and inviting atmosphere, the bungalow 
          is a perfect haven for relaxation and rejuvenation. The bright and airy interiors feature nautical-inspired decor, 
          vaulted ceilings, and large windows that welcome in the soothing sea breeze and the warm California sunlight. 

          The bungalow offers a cozy living space, a fully equipped kitchen, and spacious bedrooms designed for comfort 
          after a day of seaside adventures. Outside, a private patio with comfortable seating and lush greenery provides 
          an idyllic spot for morning coffee or evening cocktails. Located within walking distance to lively beachside cafes, 
          boutique shops, and vibrant local attractions, this bungalow delivers the quintessential San Diego beach getaway, 
          combining convenience, charm, and tranquility.`,            
          price: 450,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 2,
          address: '202 Broadway St',
          city: 'Seattle',
          state: 'Washington',
          country: 'USA',
          lat: 47.6062,
          lng: -122.3321,
          name: 'Urban Loft',
          description: `
          Perched in the bustling heart of downtown Seattle, this stylish loft offers a perfect blend of urban sophistication 
          and modern comfort. With its high ceilings, exposed brick walls, and expansive windows, the loft captures the essence 
          of contemporary city living while providing stunning views of Seattle's iconic skyline. Natural light floods the space 
          during the day, while the city lights create a dazzling ambiance by night. 

          The loft features an open-concept design, including a sleek living area, a fully equipped modern kitchen with 
          stainless steel appliances, and a luxurious bedroom designed for relaxation. Thoughtfully decorated with chic 
          furnishings and artistic touches, the space is as inspiring as it is comfortable. Conveniently located just steps from 
          world-class dining, shopping, and cultural attractions, this loft is ideal for those seeking to immerse themselves in 
          the vibrant energy of Seattle while enjoying a private, stylish retreat.
          experience by the sea.`,            
          price: 380,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 3,
          address: '303 Lakeview Drive',
          city: 'Chicago',
          state: 'Illinois',
          country: 'USA',
          lat: 41.8781,
          lng: -87.6298,
          name: 'Lakeside Condo',
          description: `
          Nestled along the shores of Lake Michigan, this luxurious condo offers an elegant retreat in the heart of Chicago.
          The property features stunning panoramic views of the lake, with its shimmering waters creating a serene backdrop to 
          your stay. Inside, the condo boasts modern furnishings, a spacious open floor plan, and floor-to-ceiling windows that
          flood the space with natural light.

          The fully equipped gourmet kitchen is perfect for preparing meals, while the cozy living area invites you to relax and
          unwind. Step out onto the private balcony to enjoy your morning coffee as the city wakes up or take in the breathtaking
          sunset over the lake. This condo is ideal for those seeking both urban excitement and lakeside tranquility.`,
          price: 420,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 1,
          address: '404 Palm Tree Lane',
          city: 'Miami',
          state: 'Florida',
          country: 'USA',
          lat: 25.7617,
          lng: -80.1918,
          name: 'Tropical Escape',
          description: `
          This tropical escape in Miami is the ultimate destination for relaxation and rejuvenation. Surrounded by lush gardens
          and swaying palm trees, the property exudes tranquility and charm. The centerpiece of this retreat is the sparkling 
          private pool, complete with lounge chairs and a shaded cabana for ultimate relaxation.

          Inside, the villa features a bright and airy living space, luxurious bedrooms, and a fully equipped kitchen. Large 
          sliding doors allow you to seamlessly transition between indoor and outdoor living. Whether lounging by the pool, exploring
          nearby beaches, or enjoying the vibrant nightlife of Miami, this tropical haven offers an unforgettable experience.`,          
          price: 550,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 2,
          address: '505 High Street',
          city: 'Austin',
          state: 'Texas',
          country: 'USA',
          lat: 30.2672,
          lng: -97.7431,
          name: 'Hill Country Retreat',
          description: `
          Nestled in the rolling hills of Austin, this serene retreat combines natural beauty with modern comfort. 
          Surrounded by picturesque landscapes, the property offers sweeping views of Texas Hill Country, making it 
          an ideal getaway from the hustle and bustle of the city.

          The home features a spacious open-concept design, including a fully equipped kitchen with high-end appliances, a 
          cozy living area with large windows, and beautifully furnished bedrooms. Outside, a large patio with comfortable 
          seating invites you to enjoy the fresh air and stunning sunsets. Whether you are relaxing at the retreat or exploring 
          Austin's vibrant culture, this property offers a perfect balance of tranquility and convenience.`,          
          price: 370,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 3,
          address: '606 Riverfront Way',
          city: 'Portland',
          state: 'Oregon',
          country: 'USA',
          lat: 45.5051,
          lng: -122.6750,
          name: 'Eco-Friendly Haven',
          description: `
          This eco-friendly haven near the river in Portland is the perfect blend of sustainability and comfort. Designed 
          with green living in mind, the property features solar panels, energy-efficient appliances, and environmentally 
          friendly materials throughout.


          The interior offers an open and inviting space with modern decor, a fully equipped kitchen, and serene bedrooms designed 
          for relaxation. Large windows provide calming views of the river and surrounding greenery, while a private deck allows 
          you to enjoy peaceful moments outdoors. Whether you are seeking a nature-filled getaway or a cozy retreat, this home offers
          an ideal escape with a focus on harmony with the environment.`,
          price: 320,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          ownerId: 1,
          address: '707 Alpine Trail',
          city: 'Aspen',
          state: 'Colorado',
          country: 'USA',
          lat: 39.1911,
          lng: -106.8175,
          name: 'Ski Lodge',
          description: `
          This luxurious ski lodge in Aspen offers an unparalleled mountain retreat with ski-in and ski-out access
          to world-class slopes. Nestled among snow-capped peaks, the lodge features a warm and inviting design with rustic
          wood accents and vaulted ceilings.
          
          Inside, you will find a spacious living area with a stone fireplace, a gourmet kitchen, and cozy bedrooms that
          provide the perfect space to unwind after a day of skiing. Outside, the private terrace allows guests to take in 
          the crisp mountain air and breathtaking views. Whether you are an adventure enthusiast or seeking a tranquil getaway, this
          lodge is the perfect destination for an unforgettable alpine experience.`,            
          price: 600,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      options,
      {
        address: { [Sequelize.Op.in]: [
          '123 Ocean Drive',
          '456 Manhattan Ave',
          '789 Mountain Road',
          '101 Sunset Blvd',
          '202 Broadway St',
          '303 Lakeview Drive',
          '404 Palm Tree Lane',
          '505 High Street',
          '606 Riverfront Way',
          '707 Alpine Trail',
        ] },
      },
      {}
    );
  },
};
