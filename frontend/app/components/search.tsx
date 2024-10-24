import { InputHTMLAttributes } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useFetcher, useLocation } from '@remix-run/react';

interface SearchProps extends InputHTMLAttributes<HTMLInputElement> {
    logo?: string;
    searchText?: string;
}

const Search: React.FC<SearchProps> = ({ logo, placeholder = '输入 Github 用户名...', ...props }) => {
    const fetcher = useFetcher();
    const { pathname } = useLocation();
    return (
        <fetcher.Form action="/user" method="post">
            <div className="rounded-full flex flex-row overflow-hidden w-full border items-center bg-white">
                {logo && <img alt="logo" src={logo} className="m-2 h-7 w-7" />}
                <input
                    {...props}
                    type="text"
                    name="name"
                    defaultValue={pathname.includes('user/') ? pathname.split('/')[2] : ''}
                    placeholder={placeholder}
                    className={`py-3 ${logo ? 'pl-1' : 'pl-5'} focus-visible:outline-none w-full pr-0`}
                />
                <button
                    type="submit"
                    className="flex flex-row gap-2 items-center pr-5 pl-1 text-main-500 text-xl focus-within:outline-none">
                    <SearchOutlined className="cursor-pointer hover:scale-110 active:scale-90 transition-all" />
                </button>
            </div>
        </fetcher.Form>
    );
};

export default Search;
