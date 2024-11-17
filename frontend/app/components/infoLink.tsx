import { LinkOutlined } from '@ant-design/icons';

interface linkProps {
    children: string;
}

const InfoLink: React.FC<linkProps> = ({ children }) => {
    return (
        <div className="flex items-center">
            <LinkOutlined className="text-gray-600 dark:text-gray-300 text-sm" />
            <a href={children} className="text-sm btn-infoLink px-1 rounded-md" target="_blank" rel="noreferrer">
                {children}
            </a>
        </div>
    );
};

interface infoIconProps {
    children: React.ReactNode;
    icon: React.ReactNode;
    href?: string;
}

export const InfoIcon: React.FC<infoIconProps> = ({ children, icon, href }) => {
    return (
        <div className="flex items-center">
            <span className="text-gray-600 dark:text-gray-300 text-sm">{icon}</span>
            {href ? (
                <a href={href} className="text-sm btn-infoLink px-1 rounded-md" target="_blank" rel="noreferrer">
                    {children}
                </a>
            ) : (
                <p className="ml-1 text-sm text-gray-600 dark:text-gray-300">{children}</p>
            )}
        </div>
    );
};

interface commonLinkProps {
    children: React.ReactNode;
    href?: string;
}
export const CommonLink: React.FC<commonLinkProps> = ({ children, href }) => {
    return (
        <a
            className="btn-infoLink text-gray-700 dark:text-gray-200 p-1 rounded-md"
            href={href}
            target="_blank"
            rel="noreferrer">
            {children}
        </a>
    );
};

export default InfoLink;
