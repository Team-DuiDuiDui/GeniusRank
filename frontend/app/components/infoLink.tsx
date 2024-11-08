import { LinkOutlined } from '@ant-design/icons';

interface linkProps {
    children: string;
}

const InfoLink: React.FC<linkProps> = ({ children }) => {
    return (
        <div className="flex items-center">
            <LinkOutlined className="text-gray-600 text-sm" />
            <a
                href={children}
                className="text-sm text-gray-600 hover:bg-gray-200 transition-all px-1 rounded-md"
                target="_blank"
                rel="noreferrer">
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
            <span className="text-gray-600 text-sm">{icon}</span>
            {href ? (
                <a
                    href={href}
                    className="text-sm text-gray-600 hover:bg-gray-200 transition-all px-1 rounded-md"
                    target="_blank"
                    rel="noreferrer">
                    {children}
                </a>
            ) : (
                <p className="ml-1 text-sm text-gray-600">{children}</p>
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
            className="text-gray-700 hover:bg-gray-200 transition-all p-1 rounded-md"
            href={href}
            target="_blank"
            rel="noreferrer">
            {children}
        </a>
    );
};

export default InfoLink;
