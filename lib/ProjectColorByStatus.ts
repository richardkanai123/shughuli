import { ProjectStatus } from "./generated/prisma";

   export const getStatusColor = (status: ProjectStatus) => {
        switch (status) {
            case "OPEN":
                return "bg-blue-500/70 text-white border-blue-200 hover:bg-blue-500/20";
            case "ONGOING":
                return "bg-orange-500/80 text-orange-100 border-orange-200 hover:bg-orange-500/20 ";
            case "COMPLETED":
                return "bg-green-500 text-lime-100 border-green-200 hover:bg-green-500/20"
            default:
                return "bg-red-500/10 text-red-500 border-red-200 hover:bg-red-500/20"
        }
    };