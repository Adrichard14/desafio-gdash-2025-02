import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import {
    LayoutDashboard,
    History,
    LogOut,
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/authContext';

export const Container = ({ children }: { children: ReactNode }) => {
    const { logout } = useAuth();
    const location = useLocation();
    const activeSidebar = location.pathname;
    const activeClasses = 'p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center';
    const defaultClasses = 'p-2 hover:bg-gray-100 rounded-lg transition flex items-center justify-center'
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 p-6">
            <div className="w-full h-full flex gap-6">
                <div className="flex flex-col gap-4">
                    <Card className="w-16 p-3 bg-white/80 backdrop-blur">
                        <div className="flex flex-col gap-4 items-center h-full">
                            <NavLink to="/dashboard">
                                <button className={`${activeSidebar === '/dashboard' ? activeClasses : defaultClasses} `} title="Dashboard">
                                    <LayoutDashboard className={`w-6 h-6 ${activeSidebar === '/dashboard' ? 'text-white' : 'text-gray-600'}`} />
                                </button>
                            </NavLink>
                            <NavLink to="/historic">
                                <button className={`${activeSidebar === '/historic' ? activeClasses : defaultClasses} `} title="Histórico">
                                    <History className={`w-6 h-6 ${activeSidebar === '/historic' ? 'text-white' : 'text-gray-600'}`} />
                                </button>
                            </NavLink>
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition mt-auto flex items-center justify-center" title="Sair" onClick={logout}>
                                <LogOut className="w-6 h-6 text-gray-600" />
                            </button>
                        </div>
                    </Card>
                </div>

                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
}