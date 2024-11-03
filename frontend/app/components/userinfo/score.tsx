import { useTranslation } from 'react-i18next';
import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import autoAnimate from '@formkit/auto-animate';
import { ZodError } from 'zod';
import { AxiosError } from 'axios';
import { githubUser } from '~/utils/requests/ghapis/user';
import { useParams } from '@remix-run/react';
import { MinimalRepository, User } from '~/utils/requests/ghapis/typings/user';
import CardScrollable from './cardScrollable';

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

    useEffect(() => {
        setScores(null);
        const intId = setInterval(() => {
            if (user.current.isFulfilled()) {
                user.current.getUserScores().then(setScores).catch(setErrors);
            }
        }, 1000);
        return () => {
            clearInterval(intId);
        };
    }, [data, user]);

    return (
        <>
            <CardScrollable title={t('user.score')}>
                <>{scores?.data.issuesScore}</>
                <>{scores?.data.prsScore}</>
                <>{scores?.data.reposScore}</>
                <>{scores?.data.userScore}</>
                <>{scores?.data.totalScore}</>
            </CardScrollable>
        </>
    );
};

export default UserScore;
