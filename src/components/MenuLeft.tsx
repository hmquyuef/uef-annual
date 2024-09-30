import { AppstoreOutlined, MailOutlined, SettingOutlined } from "@ant-design/icons";
import { Menu, MenuProps } from "antd";
import { useState } from "react";

type MenuItem = Required<MenuProps>['items'][number];

const items: MenuItem[] = [
    {
        key: '1',
        icon: <MailOutlined />,
        label: 'Navigation One',
        children: [
            { key: '11', label: 'Option 1' },
            { key: '12', label: 'Option 2' },
            { key: '13', label: 'Option 3' },
            { key: '14', label: 'Option 4' },
        ],
    },
    {
        key: '2',
        icon: <AppstoreOutlined />,
        label: 'Navigation Two',
        children: [
            { key: '21', label: 'Option 1' },
            { key: '22', label: 'Option 2' },
            {
                key: '23',
                label: 'Submenu',
                children: [
                    { key: '231', label: 'Option 1' },
                    { key: '232', label: 'Option 2' },
                    { key: '233', label: 'Option 3' },
                ],
            },
            {
                key: '24',
                label: 'Submenu 2',
                children: [
                    { key: '241', label: 'Option 1' },
                    { key: '242', label: 'Option 2' },
                    { key: '243', label: 'Option 3' },
                ],
            },
        ],
    },
    {
        key: '3',
        icon: <SettingOutlined />,
        label: 'Navigation Three',
        children: [
            { key: '31', label: 'Option 1' },
            { key: '32', label: 'Option 2' },
            { key: '33', label: 'Option 3' },
            { key: '34', label: 'Option 4' },
        ],
    },
];

interface LevelKeysProps {
    key?: string;
    children?: LevelKeysProps[];
}

const getLevelKeys = (items1: LevelKeysProps[]) => {
    const key: Record<string, number> = {};
    const func = (items2: LevelKeysProps[], level = 1) => {
        items2.forEach((item) => {
            if (item.key) {
                key[item.key] = level;
            }
            if (item.children) {
                func(item.children, level + 1);
            }
        });
    };
    func(items1);
    return key;
};

const levelKeys = getLevelKeys(items as LevelKeysProps[]); const MenuLeft = () => {
    const [isOpened, setIsOpened] = useState(true);
    const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);

    const onOpenChange: MenuProps['onOpenChange'] = (openKeys) => {
        const currentOpenKey = openKeys.find((key) => stateOpenKeys.indexOf(key) === -1);
        // open
        if (currentOpenKey !== undefined) {
            const repeatIndex = openKeys
                .filter((key) => key !== currentOpenKey)
                .findIndex((key) => levelKeys[key] === levelKeys[currentOpenKey]);

            setStateOpenKeys(
                openKeys
                    // remove repeat key
                    .filter((_, index) => index !== repeatIndex)
                    // remove current level all child
                    .filter((key) => levelKeys[key] <= levelKeys[currentOpenKey]),
            );
        } else {
            // close
            setStateOpenKeys(openKeys);
        }
    };
    return (
        <aside
            className={`flex flex-col transition-all duration-300 ${isOpened ? 'w-64' : 'w-20'}`}
        >
            <header className='h-16 flex items-center justify-center'>Menu</header>
            <hr />
            <article className='flex-1'>
                <Menu
                    style={{ width: isOpened ? 256 : 80, height: 'calc(100svh - 104px)' }}
                    defaultOpenKeys={['sub1']}
                    defaultSelectedKeys={['231']}
                    openKeys={stateOpenKeys}
                    onOpenChange={onOpenChange}

                    mode={'inline'}
                    theme={"dark"}
                    inlineCollapsed={!isOpened}
                    items={items}
                />
            </article>
            <footer className='w-full'>
                <button
                    onClick={() => setIsOpened(!isOpened)}
                    className='w-full p-2 bg-red-500 text-white'
                >
                    {isOpened ? 'Close' : 'Open'}
                </button>
            </footer>
        </aside>
    );
}

export default MenuLeft;