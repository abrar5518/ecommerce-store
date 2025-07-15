// Define a TypeScript interface for the category object
export interface Category {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    image: string;
    created_at: string;
    updated_at: string;
}

// Response structure from the API
export interface CategoryResponse {
    data: Category[];
}
