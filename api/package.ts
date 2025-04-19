import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Set this in your .env.local
});

// Get All Packages
export const getAllPackages = async () => {
    const response = await apiClient.get("/packages");
    return response.data;
};

// Get Package Details
export const getPackageDetails = async (packageId: number) => {
    const response = await apiClient.get(`/packages/${packageId}`);
    return response.data;
};

// Purchase Package (requires JWT authentication)
export const purchasePackage = async (
    data: { packageIndex: number; position: number },
) => {
    const response = await apiClient.post("/packages/purchase", data);
    return response.data;
};