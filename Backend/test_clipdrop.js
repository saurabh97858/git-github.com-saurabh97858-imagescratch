import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const CLIPDROP_API_KEY = '1e33545c650e2177eb699eaa5b3bca56a30c3c0e162c18eb90468756046cea6821a8494a55c3a2369eadbfc4250fe922';

async function testClipDrop() {
    try {
        console.log('Testing ClipDrop API directly...');
        const formData = new FormData();
        formData.append('prompt', 'a cool cat');

        const response = await axios.post(
            'https://clipdrop-api.co/text-to-image/v1',
            formData,
            {
                headers: {
                    'x-api-key': CLIPDROP_API_KEY,
                    ...formData.getHeaders(),
                },
                responseType: 'arraybuffer',
            }
        );

        console.log('ClipDrop API Success! Status:', response.status);
        console.log('Image data length:', response.data.length);

    } catch (error) {
        if (error.response) {
            console.error('ClipDrop API failed with status:', error.response.status);
            console.error('Error data:', error.response.data.toString());
        } else {
            console.error('ClipDrop API failed:', error.message);
        }
    }
}

testClipDrop();
