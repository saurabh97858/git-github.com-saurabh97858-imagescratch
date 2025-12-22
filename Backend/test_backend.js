import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

async function testServer() {
    try {
        console.log('Testing root endpoint...');
        const rootRes = await axios.get(`${BASE_URL}/`);
        console.log('Root endpoint response:', rootRes.data);

        console.log('Testing generate-image endpoint (expecting Unauthorized)...');
        try {
            const genRes = await axios.post(`${BASE_URL}/api/image/generate-image`, {
                prompt: 'test prompt'
            });
            console.log('Generate image response:', genRes.data);
        } catch (error) {
            if (error.response) {
                console.log('Generate image error response:', error.response.data);
            } else {
                console.log('Generate image error:', error.message);
            }
        }

    } catch (error) {
        if (error.response) {
            console.error('Server test failed with status:', error.response.status);
            console.error('Error data:', error.response.data);
        } else {
            console.error('Server test failed:', error.message);
        }
    }
}

testServer();
