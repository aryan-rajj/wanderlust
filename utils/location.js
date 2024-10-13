require("dotenv").config();
const mapApiKey = process.env.MAP_BOX_API;

async function forwardGeocode(address) {
    const encodedAddress = encodeURIComponent(address);
    const geocodeURL = `https://apis.mapmyindia.com/advancedmaps/v1/${mapApiKey}/geo_code?addr=${encodedAddress}`;
    
    console.log("Geocode URL:", geocodeURL); // Log the complete URL for debugging
    
    try {
        const response = await fetch(geocodeURL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json', // You can specify the expected response type
            }
        });

        // Check if the response is ok (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check for zero results
        if (!data || data.status === 'ZERO RESULTS') {
            throw new Error('Could not find coordinates for address');
        }

        const coordinates = data.features[0].geometry.coordinates;
        return coordinates;
        
    } catch (error) {
        console.error('Error:', error);
        throw error; // Propagate the error for further handling
    }
}

module.exports = forwardGeocode;
