import axios from 'axios';

async function checkCategories() {
    try {
        const response = await axios.get('https://api.escuelajs.co/api/v1/categories');
        console.log('Categories:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error fetching categories:', error.message);
    }
}

checkCategories();
