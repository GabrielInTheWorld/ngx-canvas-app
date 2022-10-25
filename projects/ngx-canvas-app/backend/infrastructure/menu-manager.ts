import { app, MenuItem, MenuItemConstructorOptions, Menu } from 'electron';

export const createMenu = (): Menu => {
    const name = app.getName();
    const template: (MenuItemConstructorOptions | MenuItem)[] = [
        {
            label: name,
            submenu: [
                {
                    label: 'About ' + name,
                    role: 'about'
                },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click(): void {
                        app.quit();
                    }
                }
            ]
        }
    ];
    return Menu.buildFromTemplate(template);
};
