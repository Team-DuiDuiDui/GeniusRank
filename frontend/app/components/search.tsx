import { InputHTMLAttributes, useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';

interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {
    logo?: string;
    searchText?: string;
    onSearch?: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ logo, placeholder = '输入 Github 用户名...', onSearch, ...props }) => {
    const [query, setQuery] = useState('');
    return (
        <div className="rounded-full flex flex-row overflow-hidden w-full border items-center bg-white">
            {logo && <img alt="logo" src={logo} className="m-2 h-7 w-7" />}
            <input
                {...props}
                type="text"
                name="name"
                placeholder={placeholder}
                className={`py-3 ${logo ? 'pl-1' : 'pl-5'} focus-visible:outline-none w-full pr-0`}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <div className="flex flex-row gap-2 items-center pr-5 pl-1 text-main-500 text-xl">
                <SearchOutlined
                    className="cursor-pointer hover:scale-110 active:scale-90 transition-all"
                    onClick={() => onSearch?.(query)}
                />
            </div>
        </div>
    );
};

export default Search;
