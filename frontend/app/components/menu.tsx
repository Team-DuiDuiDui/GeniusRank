import { useState } from 'react';
import '~/assets/css/menu.css';

const MenuIcon = () => {
    const [active, setActive] = useState(false);

    return (
        <div
            className="flex items-center justify-center w-full"
            onMouseEnter={() => setActive(true)}
            onMouseLeave={() => setActive(false)}>
            <svg className={`ham hamRotate180 ham5 ${active ? 'active' : ''}`} viewBox="0 0 100 100" width="80">
                <path
                    className={`line top ${active ? 'active' : ''}`}
                    d="m 30,33 h 40 c 0,0 8.5,-0.68551 8.5,10.375 0,8.292653 -6.122707,9.002293 -8.5,6.625 l -11.071429,-11.071429"
                />
                <path className={`line middle ${active ? 'active' : ''}`} d="m 70,50 h -40" />
                <path
                    className={`line bottom ${active ? 'active' : ''}`}
                    d="m 30,67 h 40 c 0,0 8.5,0.68551 8.5,-10.375 0,-8.292653 -6.122707,-9.002293 -8.5,-6.625 l -11.071429,11.071429"
                />
            </svg>
        </div>
    );
};

export default MenuIcon;
