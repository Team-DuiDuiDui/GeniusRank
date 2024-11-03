import { useTranslation } from 'react-i18next';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { ZodError } from 'zod';
import axios, { AxiosError } from 'axios';
import { githubUser } from '~/utils/requests/ghapis/user';
import { User } from '~/utils/requests/ghapis/typings/user';
import CardScrollable from './cardScrollable';
import toast from 'react-hot-toast';
import { BackEndError } from '~/hooks/useAxiosInstanceForBe';
import handleErrorCode from '~/utils/handleErrorCode';

interface userRepositoriesProps {
    data: User;
    user: MutableRefObject<githubUser>;
}

const UserScore: React.FC<userRepositoriesProps> = ({ data, user }) => {
    const { t } = useTranslation();
    const titleRef = useRef(null);
    const [scores, setScores] = useState<null | GithubScoreRes>(null);
    const [error, setErrors] = useState<null | AxiosError | ZodError | unknown>(null);

    useEffect(() => {
        titleRef.current && autoAnimate(titleRef.current);
    }, [titleRef]);

    const loadData = () => {
        user.current
            .getUserScores()
            .then(setScores)
            .catch((err) => {
                if (axios.isAxiosError(err)) toast.error(t('user.err.network_error'));
                else if (err instanceof BackEndError) toast.error(handleErrorCode(err.response.data.code, t));
                else toast.error(t('errorCode.unknown'));
                setErrors(err);
            });
    };
    useEffect(() => {
        setScores(null);
        const intId = setInterval(() => {
            if (user.current.isFulfilled()) {
                loadData();
                clearInterval(intId);
            }
        }, 1000);
        return () => {
            clearInterval(intId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, user]);

    return (
        <>
            <CardScrollable title={t('user.score')} data={scores} error={error} reload={loadData}>
                <>{JSON.stringify(scores)}</>
                {/* <>{scores?.data.issuesScore}</>
                <>{scores?.data.prsScore}</>
                <>{scores?.data.reposScore}</>
                <>{scores?.data.userScore}</>
                <>{scores?.data.totalScore}</> */}
            </CardScrollable>
        </>
    );
};

export default UserScore;
