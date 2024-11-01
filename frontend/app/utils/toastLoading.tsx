import { CloseButton } from "@mantine/core";
import i18next from "i18next";
import CountUp from "react-countup";
import toast from "react-hot-toast";
import { ClientOnly } from "remix-utils/client-only";

export const loading = (time: number) => toast.loading(
    (tst) => (
        <div className="flex flex-row gap-2 items-center">
            <p>
                {i18next.t('user.err.reloading_after')}{' '}
                <ClientOnly>
                    {() => (
                        <CountUp
                            start={time}
                            end={0}
                            delay={0}
                            duration={time}
                            useEasing={false}
                        />
                    )}
                </ClientOnly>{' '}
                {i18next.t('user.err.reloading_after_2')}
            </p>
            <CloseButton onClick={() => toast.dismiss(tst.id)} />
        </div>
    ),
    {
        id: 'user_reload',
    }
);