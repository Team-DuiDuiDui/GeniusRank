interface userBasic {
    children: React.ReactNode;
}

const UserBasic: React.FC<userBasic> = ({ children }) => {
    return (
        <div className="flex flex-col p-10 m-8 mb-0 w-full bg-blue-50 dark:bg-slate-800 shadow-2xl h-full rounded-t-xl gap-8">
            {children}
        </div>
    );
};

export default UserBasic;
