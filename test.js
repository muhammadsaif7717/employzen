const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

async function test() {
  const form = new FormData();
  fs.writeFileSync('test.png', 'fake image content');
  form.append('file', fs.createReadStream('test.png'));

  try {
    const res = await axios.post('http://localhost:5000/api/v1/chat/upload', form, {
      headers: form.getHeaders(),
    });
    console.log(res.data);
  } catch (err) {
    console.log(err.response?.status, err.response?.data);
  }
}
test();
