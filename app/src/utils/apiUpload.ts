export function apiUpload(
  url: string,
  formData: FormData,
  onProgress?: (percent: number) => void
): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', url);
    xhr.withCredentials = true;

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      }
    };

    xhr.onload = async () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        return resolve(JSON.parse(xhr.responseText));
      }

      if (xhr.status === 401) {
        try {
          const refreshRes = await fetch('/api/refresh_token/', {
            method: 'POST',
            credentials: 'include',
          });

          if (!refreshRes.ok) {
            return reject('Session expired. Please login again.');
          }

          return resolve(apiUpload(url, formData, onProgress));
        } catch {
          return reject('Failed to refresh token');
        }
      }

      reject(xhr.responseText);
    };

    xhr.onerror = () => reject('Network error');
    xhr.send(formData);
  });
}
