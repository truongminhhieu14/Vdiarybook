const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API_URL}/medias/upload-image`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
    },
  });
  const data = await res.json();
  console.log("data", data);
  
  const fileObj = Array.isArray(data) ? data[0] : data;

if (fileObj.secure_url) {
  return fileObj.secure_url;
} else if (fileObj.url) {
  return fileObj.url;
} else {
  throw new Error('Không lấy được URL ảnh');
}
}

export async function uploadVideo(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('video', file);

  const res = await fetch(`${API_URL}/medias/upload-video`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
    },
  });

  const data = await res.json();
  console.log("video data", data);

  const fileObj = Array.isArray(data) ? data[0] : data;

  if (fileObj.secure_url) {
    return fileObj.secure_url;
  } else if (fileObj.url) {
    return fileObj.url;
  } else {
    throw new Error('Không lấy được URL video');
  }
}

