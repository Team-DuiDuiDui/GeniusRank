import { GithubFilled } from '@ant-design/icons';

const Footer = () => {
    return (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex justify-center items-center p-2 gap-4">
            <a
                href="https://github.com/Team-DuiDuiDui/GeniusRank"
                target="_blank"
                rel="noreferrer"
                className="text-sm text-gray-500 dark:text-gray-400">
                <GithubFilled />
            </a>
            <p className="text-xs text-gray-500 dark:text-gray-400">
                Copyright © 2024 <span className="font-bold">Team-DuiDuiDui</span> Licensed under the{' '}
                <a href="https://www.apache.org/licenses/LICENSE-2.0.html" target="_blank" rel="noreferrer">
                    Apache License 2.0.
                </a>
            </p>
        </div>
    );
};

export default Footer;
