import axios from 'axios';

export async function getAuthenticated() {
  try {
    const response = await axios.get('/sanctum/csrf-cookie');
    return response.data; // return data from response
  } catch (error) {
    console.error('Error getting CSRF cookie:', error);
    throw error;
  }
}

export function downloadFile(fileID, fileName) {
  axios({
    url: `/api/download/${fileID}`,
    method: 'GET',
    responseType: 'blob',
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
  });
}

export async function downloadPetlinkFile(path, fileName) {
  await getAuthenticated();
  const response = await axios.get(`/api/assets/${path}`, {
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
}

export async function downloadLogoFile(path) {
  try {
    await getAuthenticated();
    const response = await axios.get(`/api/logo/download/${path}`, {
      responseType: 'blob',
    });
    const file = new File([response.data], 'logo.png', { type: 'image/png' });
    return {
      uid: '-1',
      name: file.name,
      status: 'done',
      url: path,
      originFileObj: file,
    };
  } catch (error) {
    console.error('Error downloading logo file:', error);
    throw error;
  }
}
