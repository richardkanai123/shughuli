import { ProjectStatus } from "./generated/prisma";

   export const getStatusColor = (status: ProjectStatus) => {
        switch (status) {
            case "OPEN":
                return "bg-blue-500/10 text-blue-500 border-blue-200 hover:bg-blue-500/20";
            case "ONGOING":
                return "bg-orange-500/10 text-orange-500 border-orange-200 hover:bg-orange-500/20 ";
            case "COMPLETED":
                return "bg-green-500/10 text-green-500 border-green-200 hover:bg-green-500/20";
        }
    };