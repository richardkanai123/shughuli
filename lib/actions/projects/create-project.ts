export const createProject = async (projectName: string) => {
    try {
        const response = await fetch("/api/projects", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ projectName }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating project:", error);
        throw error;
    }
};