import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const SearchBar = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
    <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
            placeholder="Search projects..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-9"
        />
    </div>
);

export default SearchBar;