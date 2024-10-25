import { LinkOutlined } from '@ant-design/icons';

interface linkProps {
    children: string;
}

const InfoLink: React.FC<linkProps> = ({ children }) => {
    return (
        <div className="flex items-center">
            <LinkOutlined className="text-gray-500 text-sm" />
            <a href={children} className="ml-1 text-sm text-gray-500 hover:underline">
                {children}
            </a>
        </div>
    );
};

export default InfoLink;
