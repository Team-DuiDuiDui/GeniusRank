import { LinkOutlined } from '@ant-design/icons';

interface linkProps {
    children: string;
}

const InfoLink: React.FC<linkProps> = ({ children }) => {
    return (
        <div className="flex items-center">
            <LinkOutlined className="text-gray-600 text-sm" />
            <a href={children} className="ml-1 text-sm text-gray-600 hover:underline">
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
                <a href={href} className="ml-1 text-sm text-gray-600 hover:underline">
                    {children}
                </a>
            ) : (
                <p className="ml-1 text-sm text-gray-600">{children}</p>
            )}
        </div>
    );
};

export default InfoLink;
