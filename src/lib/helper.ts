export async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const result = reader.result as string;
            const base64 = result.split(",")[1];
            resolve(base64);
        };

        reader.onerror = () => {
            reject(new Error("Failed to read file"));
        };

        reader.readAsDataURL(file);
    });
}