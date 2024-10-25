interface userBasic {
    children: React.ReactNode;
}

const UserBasic: React.FC<userBasic> = ({ children }) => {
    return (
        <div className="flex flex-col p-10 m-8 w-full bg-blue-50 shadow-2xl h-full rounded-xl gap-8">{children}</div>
    );
};

export default UserBasic;
