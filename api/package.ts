import axios from "axios";

const createApiClient = (token?: string) =>
    axios.create({
        baseURL: process.env.NEXT_PUBLIC_BACKEND_API_URL, // Set this in your .env.local
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
        },
    });

// Get All Packages
export const getAllPackages = async (token: string) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get("/packages");
    return response.data;
};

// Get Package Details
export const getPackageDetails = async (token: string, packageId: number) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.get(`/packages/${packageId}`);
    return response.data;
};

// Purchase Package (requires JWT authentication)
export const purchasePackage = async (
    token: string,
    data: { packageIndex: number; position: number },
) => {
    const apiClient = createApiClient(token);
    const response = await apiClient.post("/packages/purchase", data);
    return response.data;
};