export const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
                return 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
            case 'ONGOING':
                return 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20'
            default:
                return 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20'
        }
    }