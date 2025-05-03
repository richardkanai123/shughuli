export interface UserDetails {
    id:        string;
    email:     string;
    name:      string;
    username:  string;
    role:      string;
    createdAt: Date;
    updatedAt: Date;
    image: string | null;
    emailVerified: boolean
}