'use strict';

const bcrypt = require('bcryptjs');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // Define schema for production
}
options.tableName = 'SpotImages'; // Ensure correct table name in options

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://media.gettyimages.com/id/867413250/photo/young-group-of-friends-staying-in-a-luxury-villa-enjoying-the-hot-tub-as-the-sun-sets.jpg?s=612x612&w=0&k=20&c=V3TNMBnrf-nfl2z9o29H70VoCrJB8eBmKDF2KmU9Uxk=',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1,
        url: 'https://media.gettyimages.com/id/83802508/photo/stairs-leading-to-craftsman-house.jpg?s=612x612&w=0&k=20&c=Ai2VREsZR-l8XPf0Cn5VKputzmv0bSk4CoUUW3DZf1I=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1,
        url: 'https://media.gettyimages.com/id/88621057/photo/interior-of-modern-living-room.jpg?s=612x612&w=0&k=20&c=VtoysPnU742H62u8ZsDGxi2KHrepnR5KTJksGMcOco0=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1,
        url: 'https://media.gettyimages.com/id/sb10069474a-003/photo/modern-bathroom.jpg?s=612x612&w=0&k=20&c=ze-xwH056KvH417PDU_7AA8NLqIurotWNGiJPVLliVo=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 1,
        url: 'https://media.gettyimages.com/id/88621040/photo/interior-of-modern-living-room.jpg?s=612x612&w=0&k=20&c=_hxVh-Ag1V5s2WI6iN8bp05qEcfQYg0DBQ6aZQ3e1es=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },

      //spot 2
      {
        spotId: 2,
        url: 'https://media.gettyimages.com/id/1475073978/photo/street-in-manhattan-downtown-with-crysler-building-new-york-city-usa.jpg?s=612x612&w=0&k=20&c=95EbqyiRdGiBMC1GJgPolfTi3urmAq2xjMuNzjsGOV8=',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        url: 'https://media.gettyimages.com/id/170049161/photo/typical-brownstone-row-house-new-york-city.jpg?s=612x612&w=0&k=20&c=W3MVy9qVDMb3yChHv5jSa8Wm_97mLTUGW9QKlGWo8BA=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        url: 'https://media.gettyimages.com/id/1293762741/photo/modern-living-room-interior-3d-render.jpg?s=612x612&w=0&k=20&c=iZ561ZIXOtPYGSzqlKUnLrliorreOYVz1pzu8WJmrnc=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        url: 'https://media.gettyimages.com/id/1990444472/photo/scandinavian-style-cozy-living-room-interior.jpg?s=612x612&w=0&k=20&c=qgzrs_4vKDrOVo6gVc0EVb9-PziE-REbV9DcM5ZAfig=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 2,
        url: 'https://media.gettyimages.com/id/1321311451/photo/cozy-living-room-at-industrial-loft-open-space.jpg?s=612x612&w=0&k=20&c=V81RvTFG54oQGxhOL8rUTplqy9ZHlq0Q5ZD8dNAQjf4=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      //spot 3
      {
        spotId: 3,
        url: 'https://media.gettyimages.com/id/155381852/photo/boulder-colorado-flatirons-in-fall.jpg?s=612x612&w=0&k=20&c=b4YoQN3PsRr4fjbztmm4z1mCyRB2pAbxisZ1yTZOtUo=',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        url: 'https://media.gettyimages.com/id/2102727897/photo/western-style-house-in-denver-colorado.jpg?s=612x612&w=0&k=20&c=Plqi_VqsE9e18WLZtuJrDPzOyCXM6b2C8NEUUg33M1w=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        url: 'https://media.gettyimages.com/id/1357529194/photo/3d-rendering-of-a-modern-styled-living-room-with-fireplace.jpg?s=612x612&w=0&k=20&c=bBBhHQnZLal9xoH9fGhAEg33CDVF0msBfB7l9cLTU_s=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        url: 'https://media.gettyimages.com/id/1990444472/photo/scandinavian-style-cozy-living-room-interior.jpg?s=612x612&w=0&k=20&c=qgzrs_4vKDrOVo6gVc0EVb9-PziE-REbV9DcM5ZAfig=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 3,
        url: 'https://media.gettyimages.com/id/1440620214/photo/scandinavian-style-kitchen.jpg?s=612x612&w=0&k=20&c=Nj4fsAtE7yNhADlRdWjY3YanUbE9yGtdWIkwPgHQVDQ=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      //spot 4
      {
        spotId: 4,
        url: 'https://media.gettyimages.com/id/505893277/photo/san-diego-skyline-ca.jpg?s=612x612&w=0&k=20&c=Ul7UIfmiOyyPMk22btwbTFG2a8cnau0srfJGBzKO8Zo=',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 4,
        url: 'https://media.gettyimages.com/id/1135389480/photo/a-beautiful-wooden-house-in-the-coronado-island-district-in-san-diego-southern-california.jpg?s=612x612&w=0&k=20&c=xrMAk3lfxHoDFwNVuAlSacJ5jP65aysgwU1xqxnCWlo=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 4,
        url: 'https://media.gettyimages.com/id/135386192/photo/sunrise-sunset-modernist-home-woman-at-table.jpg?s=612x612&w=0&k=20&c=nj2XGC03M0sU-Wf5mVULmOODnSF0UAfyCn6IZBdzDfo=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 4,
        url: 'https://media.gettyimages.com/id/1356289103/photo/luxurious-seaside-villa-interior.jpg?s=612x612&w=0&k=20&c=7-IodJ3UZF1smU78eabFXj5-GKznvEKr5J4G3KYUeLs=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 4,
        url: 'https://media.gettyimages.com/id/1304916765/photo/summer-villa-interior-with-pool-and-sea-view.jpg?s=612x612&w=0&k=20&c=JdNTtNRZIJ0C-Q9PgZuiGKE3Xh7Oc8I6Gt-3_ar5rPA=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      //spot 5
      {
        spotId: 5,
        url: 'https://media.gettyimages.com/id/479505626/photo/seattle-space-needle-downtown-skyscrapers-illuminated-dusk-panorama-washington-usa.jpg?s=612x612&w=0&k=20&c=ZO-EClG4htYQ006RlyDooAhCLm_Qz2XbAcKdBpBq1cY=',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 5,
        url: 'https://media.gettyimages.com/id/157508439/photo/front-yards-of-all-american-homes.jpg?s=612x612&w=0&k=20&c=hfkAcerm_B0g7w-l8rP_H7_h4M3Ryju_qof9fxKc3zM=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 5,
        url: 'https://media.gettyimages.com/id/1423693240/photo/house-seattle-washington-usa-shingle-wall.jpg?s=612x612&w=0&k=20&c=3FoomTMvFtICku9cQ9Y4CZ7L7KY3eqP2PTfn0lcTu_A=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 5,
        url: 'https://media.gettyimages.com/id/1357529194/photo/3d-rendering-of-a-modern-styled-living-room-with-fireplace.jpg?s=612x612&w=0&k=20&c=bBBhHQnZLal9xoH9fGhAEg33CDVF0msBfB7l9cLTU_s=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 5,
        url: 'https://media.gettyimages.com/id/1421422160/photo/interior-of-living-room.jpg?s=612x612&w=0&k=20&c=r8Hyrk-1JtHSJS8TA5BfostSuIEd6-L2fLYMoyEBf_E=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      //spot 6
      {
        spotId: 6,
        url: 'https://media.gettyimages.com/id/1227226232/photo/chicago-skyline-from-the-park.jpg?s=612x612&w=0&k=20&c=UyRErOvCloHvxxo1FlgybLFXCFJuM7JPbtIEzVZ7bdo=',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 6,
        url: 'https://media.gettyimages.com/id/157286746/photo/prairie-avenue-mansions-in-chicago.jpg?s=612x612&w=0&k=20&c=DcSQOBxiTTtHsiYbpUNHpFW1pLWIyycuhbpyuRM9G9A=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 6,
        url: 'https://media.gettyimages.com/id/1836568069/photo/aerial-view-over-houses-in-wicker-park-revealing-chicago-loop-skyline.jpg?s=612x612&w=0&k=20&c=2xedjNwspKuBv4nrUd_6AZsu_YuovySyZ8rDBa14v9Y=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 6,
        url: 'https://media.gettyimages.com/id/1293762741/photo/modern-living-room-interior-3d-render.jpg?s=612x612&w=0&k=20&c=iZ561ZIXOtPYGSzqlKUnLrliorreOYVz1pzu8WJmrnc=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 6,
        url: 'https://media.gettyimages.com/id/1311356176/photo/modern-luxury-home-interior.jpg?s=612x612&w=0&k=20&c=aAl2273jMoFxiDcU-ahN57Ky84dbxuOYgdzwN1-Pdpk=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      //spot 7
      {
        spotId: 7,
        url: 'https://media.gettyimages.com/id/802893644/photo/aerial-view-of-downtown-miami-florida.jpg?s=612x612&w=0&k=20&c=QwdSYtoeB-9xTvqgbpnM9aCaRf_39rw8bVw7LsszSGg=',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 7,
        url: 'https://media.gettyimages.com/id/1392098694/photo/pathway-with-palm-trees-leading-to-the-beach-miami-beach-florida-usa.jpg?s=612x612&w=0&k=20&c=3rnNfwm2bCrcs2LeOehxod-c1FcvpWBgvNLl7h9eDko=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 7,
        url: 'https://media.gettyimages.com/id/1411368485/photo/spanish-style-home-in-sunny-miami-suburb.jpg?s=612x612&w=0&k=20&c=Cdovcox1AFJTSQ_K0dfEIdauFHZfOT6VfZHQ5jmUYFw=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 7,
        url: 'https://media.gettyimages.com/id/172384742/photo/estate-living.jpg?s=612x612&w=0&k=20&c=oGsDxFPflxWwfMLOMndan3rL2Sd0aEHiXEWdX-cbg34=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 7,
        url: 'https://media.gettyimages.com/id/529556443/photo/outdoor-dining-and-swimming-pool.jpg?s=612x612&w=0&k=20&c=ZClZZJ5TMqT7WXZeEudyXKh1uj6QIkuBTjuQWDkukrM=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      //spot 8
      {
        spotId: 8,
        url: 'https://media.gettyimages.com/id/157425334/photo/austin-skyscraper-and-sign.jpg?s=612x612&w=0&k=20&c=gVIPS5or9_-y0G-UWtvTUxk5hHZllGuSFYyK1nTnRWQ=',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 8,
        url: 'https://media.gettyimages.com/id/1661475806/photo/family-gathered-at-the-table-at-home.jpg?s=612x612&w=0&k=20&c=PHK6ydohzurnbB7ATY4i4-NeBUDufNGEey4n-WYq0SI=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 8,
        url: 'https://media.gettyimages.com/id/1334118685/photo/computer-generated-image-of-interior-of-bathroom-in-3d-with-houseplant.jpg?s=612x612&w=0&k=20&c=5jnGzz3zsNA4MtiyWXBAN1MfIcmVYDpNO1HsAqPuCIo=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 8,
        url: 'https://media.gettyimages.com/id/1146103884/photo/couple-admiring-the-view-from-the-living-room-of-their-house.jpg?s=612x612&w=0&k=20&c=TOvQg_G5woOb3W21v82iqEJL2ks9yRkaVIwd7USNNSY=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 8,
        url: 'https://media.gettyimages.com/id/1386951933/photo/3d-rendering-on-luxurious-apartment-interior.jpg?s=612x612&w=0&k=20&c=2qGH4U9TL-mCtLQ-eNLWMZbjz2u4hzazDIdu5GAtQZQ=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      //spot 9
      {
        spotId: 9,
        url: 'https://media.gettyimages.com/id/157607453/photo/portland-skyline.jpg?s=612x612&w=0&k=20&c=mEL-mO9ZBG2pjEBMDn8HDDdTo9bP8tgL7QO52aSrIFY=',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 9,
        url: 'https://media.gettyimages.com/id/1332576901/photo/low-angle-shot-of-a-mid-century-modern-design-house-in-portland-oregon.jpg?s=612x612&w=0&k=20&c=qLlo4BhwJn8WL0TL_6XyvQDPc8xceYnsDGY8w9HeNWY=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 9,
        url: 'https://media.gettyimages.com/id/1175602956/photo/wide-exterior-shot-of-a-1940-style-bungalow-style-house-in-portland-oregon.jpg?s=612x612&w=0&k=20&c=CXK7qh2y3WLvH4kUfMVUguRxo70ENJhOZqEtp02umO0=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 9,
        url: 'https://media.gettyimages.com/id/1436398636/photo/sofa-with-coffee-table-by-window-in-living-room.jpg?s=612x612&w=0&k=20&c=0CQ_6hbcBUr2LGc3NnJ7IVndRyx7NTLNKby7m2av-20=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 9,
        url: 'https://media.gettyimages.com/id/1411605828/photo/modern-elegant-kitchen-stock-photo.jpg?s=612x612&w=0&k=20&c=m6Up1jiMgcACQdnIoCRAnu4towncVGXNwcB-ymDKXTE=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      //spot 10
      {
        spotId: 10,
        url: 'https://media.gettyimages.com/id/478656454/photo/maroon-bells-autumn-aspen-trees-lake-reflections-aspen-colorado.jpg?s=612x612&w=0&k=20&c=1PFoVcuH1Xo47V9oRjTfGTpEQd-9KBjV8PN-rd9Lyfk=',
        preview: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 10,
        url: 'https://media.gettyimages.com/id/154895058/photo/mountain-lodge-and-skating-rink.jpg?s=612x612&w=0&k=20&c=liP3dwAz4zu0BMXtDnsB78fid3jRNGBN3K4pYGQr02k=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 10,
        url: 'https://media.gettyimages.com/id/511318052/photo/winter-landscape-with-ski-lodge-in-austrian-alps.jpg?s=612x612&w=0&k=20&c=dJ5TcRM9PU_id_r-DBz3F4tnhbXNuPpe-Wg_0ly6feQ=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 10,
        url: 'https://media.gettyimages.com/id/541397786/photo/ski-lodge-in-fanes-senes-braies-natural-park.jpg?s=612x612&w=0&k=20&c=-AcWnjHRR7OR9CV93yQh4ZM6063x2CjhYli8u9RsDQY=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        spotId: 10,
        url: 'https://media.gettyimages.com/id/157529978/photo/base-ski-lodge.jpg?s=612x612&w=0&k=20&c=0Wa5Snn9jQozimpfhYxafJyU0-V22HqpZK7lj4UCmWc=',
        preview: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete(options, null, {});
  },
};
