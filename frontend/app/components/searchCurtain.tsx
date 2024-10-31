import { useTranslation } from 'react-i18next';
import githubCat from '~/assets/github.svg';
import Search from '~/components/search';

const SearchCurtain = () => {
    const { t } = useTranslation();
    return (
        <div
            className="flex flex-col items-center w-full absolute top-0 bg-gradient-to-b from-white pt-10"
            style={{ height: 'calc(100vh * 3 / 7)' }}>
            <div className="w-3/5 lg:w-1/3 sticky top-1">
                <Search logo={githubCat} placeholder={t('search.placeholder')} />
            </div>
        </div>
    );
};

export default SearchCurtain;
