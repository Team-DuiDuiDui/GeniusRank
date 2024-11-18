import { EnvironmentTwoTone, IdcardTwoTone, PieChartTwoTone, ProfileTwoTone } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';

const UserDescription = () => {
    const { t } = useTranslation();
    return (
        <>
            <div className="flex flex-col md:flex-row my-16 justify-around gap-6 lg:gap-0">
                <div className="flex flex-col lg:flex-row justify-around gap-6 lg:w-1/2">
                    <div className="flex flex-col items-center gap-4 lg:w-1/2">
                        <IdcardTwoTone className="text-9xl dark:hidden" twoToneColor="#60A5FA" />
                        <IdcardTwoTone className="text-9xl hidden dark:flex" twoToneColor="#1864ab" />
                        <h3 className="text-3xl font-bold">{t('user.card_title')}</h3>
                        <p className="text-lg w-5/6 xl:w-2/3 ">{t('user.card_description')}</p>
                    </div>
                    <div className="flex flex-col items-center gap-4 lg:w-1/2">
                        <PieChartTwoTone className="text-9xl dark:hidden" twoToneColor="#60A5FA" />
                        <PieChartTwoTone className="text-9xl hidden dark:flex" twoToneColor="#1864ab" />
                        <h3 className="text-3xl font-bold">{t('user.graph_title')}</h3>
                        <p className="text-lg w-5/6 xl:w-2/3">{t('user.graph_description')}</p>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row justify-around gap-6 lg:w-1/2">
                    <div className="flex flex-col items-center gap-4 lg:w-1/2">
                        <ProfileTwoTone className="text-9xl dark:hidden" twoToneColor="#60A5FA" />
                        <ProfileTwoTone className="text-9xl hidden dark:flex" twoToneColor="#1864ab" />
                        <h3 className="text-3xl font-bold">{t('user.list_title')}</h3>
                        <p className="text-lg w-5/6 xl:w-2/3">{t('user.list_description')}</p>
                    </div>
                    <div className="flex flex-col items-center gap-4 lg:w-1/2">
                        <EnvironmentTwoTone className="text-9xl dark:hidden" twoToneColor="#60A5FA" />
                        <EnvironmentTwoTone className="text-9xl hidden dark:flex" twoToneColor="#1864ab" />
                        <h3 className="text-3xl font-bold">{t('user.location_title')}</h3>
                        <p className="text-lg w-5/6 xl:w-2/3">{t('user.location_description')}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UserDescription;
